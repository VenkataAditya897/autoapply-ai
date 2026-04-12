import asyncio
import os
from datetime import datetime, timedelta

from telethon import TelegramClient

from app.core.db import SessionLocal
from app.models.telegram_account import TelegramAccount
from app.models.user_channel import UserChannel
from app.models.telegram_message import TelegramMessage
from app.models.job import Job
from app.models.classified_message import ClassifiedMessage

from app.services.classifier import classify_message
from app.services.router import route_message
from app.queue import push_job

from app.core.config import TELEGRAM_API_ID, TELEGRAM_API_HASH


# ✅ IST TIME RANGE
def get_today_ist_range():
    now_utc = datetime.utcnow()
    now_ist = now_utc + timedelta(hours=5, minutes=30)

    start_ist = now_ist.replace(hour=0, minute=0, second=0, microsecond=0)
    start_utc = start_ist - timedelta(hours=5, minutes=30)

    return start_utc, now_utc


async def fetch_and_process():
    db = SessionLocal()

    try:
        print("🔥 Batch Telegram Processor Started...")

        acc = db.query(TelegramAccount).filter_by(user_id=1).first()

        if not acc:
            print("❌ No telegram account")
            return

        channels = [
            c.channel_name
            for c in db.query(UserChannel).filter_by(user_id=1)
        ]

        if not channels:
            print("❌ No channels")
            return

        client = TelegramClient(
            acc.session_name,
            TELEGRAM_API_ID,
            TELEGRAM_API_HASH
        )

        await client.start()

        start_utc, now_utc = get_today_ist_range()

        print("📅 Fetching messages from today (IST)...")

        total = 0
        queued = 0
        # with open("debug_messages.txt", "w", encoding="utf-8") as f:
        #     f.write("=== TELEGRAM DEBUG LOG ===\n\n")

        for channel in channels:
            print(f"\n📡 Reading channel: {channel}")

            # get proper channel name
            chat = await client.get_entity(channel)
            source = getattr(chat, "title", channel)

            async for msg in client.iter_messages(channel, limit=100):

                text = msg.message
                # with open("debug_messages.txt", "a", encoding="utf-8") as f:
                #     f.write(f"CHANNEL: {source}\n")
                #     f.write(f"TIME: {msg.date}\n")
                #     f.write(f"TEXT:\n{text}\n")
                #     f.write("-" * 50 + "\n\n")
                if not text:
                    continue

                msg_time = msg.date.replace(tzinfo=None)

                # ✅ skip old messages (DO NOT BREAK)
                if msg_time < start_utc:
                    continue

                total += 1

                # ---------- SAVE ----------
                existing_msg = db.query(TelegramMessage).filter_by(
                    telegram_id=msg.id,
                    user_id=1
                ).first()

                if existing_msg:
                    db_msg = existing_msg
                else:
                    db_msg = TelegramMessage(
                        user_id=1,
                        telegram_id=msg.id,
                        message_text=text,
                        source=source,
                        raw_data={}
                    )
                    db.add(db_msg)
                    db.commit()
                    db.refresh(db_msg)

                # ---------- JOB CHECK ----------
                existing_job = db.query(Job).filter(
                    Job.message_id == db_msg.id
                ).first()

                if existing_job:
                    continue

                # ---------- CLASSIFY ----------
                result = classify_message(text)

                classified = ClassifiedMessage(
                    message_id=db_msg.id,
                    type=result["type"],
                    emails=result["emails"],
                    phones=result["phones"],
                    links=result["links"]
                )

                db.add(classified)
                db.commit()

                job = route_message(db, classified, db_msg)

                if job.type == "email":
                    push_job(job.id)
                    queued += 1

                print(f"✅ Job queued {job.id}")

        await client.disconnect()

        print("\n🎯 DONE")
        print(f"📊 Total messages read: {total}")
        print(f"📨 Jobs queued: {queued}")

    except Exception as e:
        print("❌ Error:", e)

    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(fetch_and_process())