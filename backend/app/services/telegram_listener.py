from telethon import TelegramClient, events
from app.core.db import SessionLocal
from app.models.telegram_message import TelegramMessage
from app.services.classifier import classify_message
from app.models.classified_message import ClassifiedMessage
from app.services.router import route_message

api_id = 34855418
api_hash = "2b91a602f83f3414ab6b5af6fd39a5f0"


async def start_user_listener(user_id, session_name, channels):
    client = TelegramClient(session_name, api_id, api_hash)

    await client.start()

    @client.on(events.NewMessage(chats=channels))
    async def handler(event):
        db = SessionLocal()

        try:
            text = event.raw_text

            telegram_msg = TelegramMessage(
                user_id=user_id,
                message_text=text,
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

            route_message(db, classified, telegram_msg)

        except Exception as e:
            print("❌ Error:", e)

        finally:
            db.close()

    await client.run_until_disconnected()