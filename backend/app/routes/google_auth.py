from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.deps import get_current_user
from app.models.google_account import GoogleAccount
import requests
import os
from app.models.telegram_account import TelegramAccount
from worker_telegram import active_sessions
router = APIRouter()

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

# ---------------- LOGIN ----------------


@router.get("/google/login")
def google_login(user_id: int = Depends(get_current_user)):
    url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email&access_type=offline&prompt=consent&state={user_id}"
    
    return {"url": url}
# ---------------- CALLBACK ----------------
@router.get("/google/callback")
def google_callback(
    code: str,
    state: str,   # 👈 THIS
    db: Session = Depends(get_db)
):
    user_id = int(state) 
    # exchange code
    token_url = "https://oauth2.googleapis.com/token"

    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    token_res = requests.post(token_url, data=data).json()

    access_token = token_res.get("access_token")
    refresh_token = token_res.get("refresh_token")

    # get user email
    user_info = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()

    email = user_info.get("email")

    acc = db.query(GoogleAccount).filter_by(user_id=user_id).first()

    if acc:
        acc.access_token = access_token
        acc.refresh_token = refresh_token
        acc.email = email
    else:
        acc = GoogleAccount(
            user_id=user_id,
            email=email,
            access_token=access_token,
            refresh_token=refresh_token
        )
        db.add(acc)

    db.commit()

    return RedirectResponse("http://localhost:3000/dashboard")
@router.get("/google/status")
def gmail_status(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    acc = db.query(GoogleAccount).filter_by(user_id=user_id).first()

    return {
        "connected": acc is not None,
        "email": acc.email if acc else None
    }
@router.post("/google/disconnect")
async def disconnect_google(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    acc = db.query(GoogleAccount).filter_by(user_id=user_id).first()

    if not acc:
        return {"message": "Already disconnected"}

    # ✅ STEP 1: DELETE GOOGLE
    db.delete(acc)

    # ✅ STEP 2: STOP TELEGRAM LISTENER
    tg = db.query(TelegramAccount).filter_by(user_id=user_id).first()

    if tg:
        tg.is_running = False

    db.commit()

    # ✅ STEP 3: FORCE DISCONNECT TELEGRAM CLIENT
    client = active_sessions.get(user_id)

    if client and client != "starting":
        try:
            await client.disconnect()
            print("🛑 Telegram stopped due to Google disconnect")
        except Exception as e:
            print("❌ Error stopping telegram:", e)

    # ✅ STEP 4: REMOVE FROM MEMORY
    if user_id in active_sessions:
        del active_sessions[user_id]

    return {"message": "disconnected"}