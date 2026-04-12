from telethon import TelegramClient, events
from app.core.db import SessionLocal
from app.models.telegram_message import TelegramMessage
from app.services.classifier import classify_message
from app.models.classified_message import ClassifiedMessage
from app.services.router import route_message
from app.services.email_processor import process_email_job
from app.core.config import TELEGRAM_API_ID, TELEGRAM_API_HASH
from app.queue import push_job
from app.models.telegram_account import TelegramAccount

import asyncio
def is_running(user_id):
    db = SessionLocal()
    try:
        acc = db.query(TelegramAccount).filter_by(user_id=user_id).first()
        return acc and acc.is_running
    finally:
        db.close()
async def start_user_listener(user_id, session_name, channels, client_store):
    while True:  # 🔥 NEVER STOP LOOP
        try:
            print(f"🟢 Listener ACTIVE for user {user_id}")
            if not is_running(user_id):
                print(f"🛑 Stopping listener for {user_id}")
                return


            client = TelegramClient(session_name, TELEGRAM_API_ID, TELEGRAM_API_HASH)
            await client.start()

            client_store[user_id] = client

            @client.on(events.NewMessage(chats=channels))
            async def handler(event):
                db = SessionLocal()
                try:
                    text = event.raw_text
                    chat = await event.get_chat()
                    source = getattr(chat, "title", "unknown")

                    telegram_msg = TelegramMessage(
                        user_id=user_id,
                        message_text=text,
                        source=source,
                        raw_data={}
                    )
                    db.add(telegram_msg)
                    db.commit()
                    db.refresh(telegram_msg)

                    result = classify_message(text)

                    classified = ClassifiedMessage(
                        message_id=telegram_msg.id,
                        type=result["type"],
                        emails=result["emails"],
                        phones=result["phones"],
                        links=result["links"]
                    )

                    db.add(classified)
                    db.commit()

                    job = route_message(db, classified, telegram_msg)


                    push_job({
                        "job_id": job.id,
                        "type": job.type
                    })

                except Exception as e:
                    print("❌ Handler error:", e)
                finally:
                    db.close()

            try:
                await client.run_until_disconnected()
            finally:
                await client.disconnect()

        except Exception as e:
            print(f"🔥 Listener crashed for user {user_id}:", e)
            # ❌ remove broken session
            if user_id in client_store:
                del client_store[user_id]

        # 🔁 AUTO RESTART AFTER CRASH
        print(f"🔄 Restarting listener for user {user_id} in 5s...")
        await asyncio.sleep(5)