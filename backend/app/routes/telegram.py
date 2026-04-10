from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.deps import get_current_user

from app.models.telegram_account import TelegramAccount
from app.models.user_channel import UserChannel
from fastapi import HTTPException

from telethon import TelegramClient
import os
from app.core.config import TELEGRAM_API_ID, TELEGRAM_API_HASH
import redis
from app.services.telegram_listener import is_running
from worker_telegram import active_sessions  # 👈 import this

SESSION_DIR = "sessions"
os.makedirs(SESSION_DIR, exist_ok=True)

router = APIRouter()
r = redis.Redis(host="localhost", port=6379, db=0)


# ---------------- SEND OTP ----------------
@router.post("/send-otp")
async def send_otp(phone: str,user_id: int = Depends(get_current_user)):
    if not phone.startswith("+"):
        raise HTTPException(
            status_code=400,
            detail="Please include country code (e.g. +918978057144)"
        )
    session_name = os.path.join(SESSION_DIR, f"user_{phone}")
    client_existing = active_sessions.get(user_id)

    if client_existing and client_existing != "starting":
        try:
            await client_existing.disconnect()
            print("🛑 Stopped existing listener before OTP")
        except Exception as e:
            print("Error stopping existing client:", e)


    client = TelegramClient(session_name, TELEGRAM_API_ID, TELEGRAM_API_HASH)
    await client.connect()

    try:
        result = await client.send_code_request(phone)

        # ✅ STORE HASH
        r.set(f"otp:{phone}", result.phone_code_hash, ex=300)

    except Exception as e:
        print("❌ TELEGRAM ERROR send OTP:", e)
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        await client.disconnect()

    return {"message": "OTP sent"}

# ---------------- VERIFY ----------------
@router.post("/verify")
async def verify(
    phone: str,
    code: str,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    session_name = os.path.join(SESSION_DIR, f"user_{phone}")


    # ❌ check if OTP exists
    phone_code_hash = r.get(f"otp:{phone}")

    if not phone_code_hash:
        raise HTTPException(status_code=400, detail="OTP expired or not requested")

    phone_code_hash = phone_code_hash.decode()

    

    client = TelegramClient(session_name, TELEGRAM_API_ID, TELEGRAM_API_HASH)
    await client.connect()

    try:
        await client.sign_in(
            phone=phone,
            code=code,
            phone_code_hash=phone_code_hash
        )
    except Exception as e:
        print("❌ TELEGRAM ERROR vefIFY OTP:", e)
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        await client.disconnect()


    acc = db.query(TelegramAccount).filter_by(user_id=user_id).first()

    if acc:
        acc.phone = phone
        acc.session_name = session_name
        acc.is_connected = True
    else:
        acc = TelegramAccount(
            user_id=user_id,
            phone=phone,
            session_name=session_name,
            is_connected=True,
            is_running=False
        )
        db.add(acc)

    db.commit()

    return {"message": "connected"}

# ---------------- ADD CHANNEL ----------------
@router.post("/add-channel")
def add_channel(
    channel: str,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    db.add(UserChannel(user_id=user_id, channel_name=channel))
    db.commit()

    return {"message": "added"}


# ---------------- START ----------------
@router.post("/start")
async def start_listener(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    acc = db.query(TelegramAccount).filter_by(user_id=user_id).first()

    if not acc:
        raise HTTPException(status_code=400, detail="Telegram not connected")

    channels = [
        c.channel_name
        for c in db.query(UserChannel).filter_by(user_id=user_id)
    ]

    # ✅ ONLY mark as running
    acc.is_running = True
    db.commit()

    return {"message": "listener scheduled"}
# ---------------- STOP ----------------
@router.post("/stop")
async def stop_listener(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    # cancel task
    

    acc = db.query(TelegramAccount).filter_by(user_id=user_id).first()
    if acc:
        acc.is_running = False
        db.commit()

    return {"message": "stopped"}
@router.get("/status")
def get_status(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    acc = db.query(TelegramAccount).filter_by(user_id=user_id).first()

    return {
        "connected": acc.is_connected if acc else False,
        "running": acc.is_running if acc else False,
        "phone": acc.phone if acc else None
    }

@router.post("/disconnect")
async def disconnect(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    acc = db.query(TelegramAccount).filter_by(user_id=user_id).first()

    if not acc:
        raise HTTPException(status_code=400, detail="Not connected")

    # ✅ STEP 1: STOP FLAG
    acc.is_running = False
    db.commit()

    # ✅ STEP 2: DISCONNECT CLIENT (CRITICAL)
    client = active_sessions.get(user_id)

    if client and client != "starting":
        try:
            await client.disconnect()
            print("✅ Client disconnected")
        except Exception as e:
            print("❌ Error disconnecting client:", e)

    # ✅ STEP 3: REMOVE FROM MEMORY
    if user_id in active_sessions:
        del active_sessions[user_id]

    # ⏳ IMPORTANT: give time for file release
    import asyncio
    await asyncio.sleep(1)

    # ✅ STEP 4: DELETE FILE
    try:
        if os.path.exists(acc.session_name + ".session"):
            os.remove(acc.session_name + ".session")

        if os.path.exists(acc.session_name + ".session-journal"):
            os.remove(acc.session_name + ".session-journal")

    except Exception as e:
        print("Error deleting session:", e)

    # ✅ STEP 5: UPDATE DB
    acc.is_connected = False
    acc.is_running = False
    db.commit()

    return {"message": "disconnected"}
# ---------------- GET CHANNELS ----------------
@router.get("/channels")
def get_channels(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    channels = db.query(UserChannel).filter_by(user_id=user_id).all()
    return [c.channel_name for c in channels]


# ---------------- REMOVE CHANNEL ----------------
@router.post("/remove-channel")
def remove_channel(
    channel: str,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    db.query(UserChannel).filter_by(
        user_id=user_id,
        channel_name=channel
    ).delete()

    db.commit()
    return {"message": "removed"}