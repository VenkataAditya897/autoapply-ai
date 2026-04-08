import asyncio
import sys
import os

# ✅ IMPORTANT: fix imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.db import SessionLocal
from app.models.telegram_account import TelegramAccount
from app.models.user_channel import UserChannel
from app.services.telegram_listener import start_user_listener

active_sessions = {}

async def main():
    print("🔥 Telegram Worker Started...")

    while True:
        db = SessionLocal()

        try:
            users = db.query(TelegramAccount).filter_by(is_running=True).all()

            for acc in users:
                user_id = acc.user_id

                # ✅ avoid duplicate listeners
                if user_id in active_sessions:
                    continue

                channels = [
                    c.channel_name
                    for c in db.query(UserChannel).filter_by(user_id=user_id)
                ]

                if not channels:
                    continue

                print(f"🚀 Starting listener for user {user_id}")

                # ✅ mark BEFORE starting (CRITICAL FIX)
                active_sessions[user_id] = True

                asyncio.create_task(
                    start_user_listener(
                        user_id,
                        acc.session_name,
                        channels,
                        active_sessions
                    )
                )
            running_ids = [acc.user_id for acc in users]

            # detect stopped users
            for uid in list(active_sessions.keys()):
                if uid not in running_ids:
                    print(f"🛑 Stopping listener for user {uid}")
                    del active_sessions[uid]

        except Exception as e:
            print("❌ Worker error:", e)

        finally:
            db.close()

        await asyncio.sleep(5)
    

if __name__ == "__main__":
    asyncio.run(main())