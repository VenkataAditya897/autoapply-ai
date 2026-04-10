from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.deps import get_current_user
from app.models.telegram_message import TelegramMessage
from app.models.classified_message import ClassifiedMessage
from app.models.job import Job
from sqlalchemy import func
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard")
def dashboard(
    range: str = "day",  # day / week / month
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    # -------- TIME FILTER --------
    now = datetime.utcnow()

    if range == "day":
        start = now - timedelta(days=1)
    elif range == "week":
        start = now - timedelta(days=7)
    else:
        start = now - timedelta(days=30)

    # -------- TOTAL MESSAGES --------
    total = db.query(TelegramMessage)\
        .filter(TelegramMessage.user_id == user_id)\
        .filter(TelegramMessage.created_at >= start)\
        .count()

    # -------- BY SOURCE --------
    sources = db.query(
        TelegramMessage.source,
        func.count().label("count")
    ).filter(TelegramMessage.user_id == user_id)\
    .filter(TelegramMessage.created_at >= start)\
    .group_by(TelegramMessage.source).all()

    # -------- TYPES --------
    types = db.query(
        ClassifiedMessage.type,
        func.count().label("count")
    ).join(TelegramMessage, ClassifiedMessage.message_id == TelegramMessage.id)\
    .filter(TelegramMessage.user_id == user_id)\
    .filter(ClassifiedMessage.created_at >= start)\
    .group_by(ClassifiedMessage.type).all()

    # -------- LLM STATUS --------
    llm = db.query(
        Job.status,
        func.count().label("count")
    ).filter(Job.user_id == user_id)\
    .filter(Job.created_at >= start)\
    .group_by(Job.status).all()

    # -------- LATEST MESSAGE --------
    latest = db.query(TelegramMessage)\
        .order_by(TelegramMessage.created_at.desc())\
        .first()

    sent = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.status == "sent")\
        .count()

    pending = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.status == "pending")\
        .count()

    # ---------------- EMAILS ----------------
    email_sent = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "email")\
        .filter(Job.status == "sent")\
        .count()

    email_pending = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "email")\
        .filter(Job.status == "pending")\
        .count()

    # ---------------- LINKS ----------------
    links_pending = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "link")\
        .count()

    # ---------------- GOOGLE FORMS ----------------
    forms_pending = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "form")\
        .count()

    # ---------------- PHONE ----------------
    phones_pending = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "phone")\
        .count()

    # ---------------- TOTAL ----------------
    total_jobs = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .count()

    return {
        "total_jobs": total_jobs,

        "emails": {
            "sent": email_sent,
            "pending": email_pending
        },

        "links": {
            "sent": 0,  # not implemented yet
            "pending": links_pending
        },

        "forms": {
            "sent": 0,
            "pending": forms_pending
        },

        "phones": {
            "sent": 0,
            "pending": phones_pending
        }
    }
@router.get("/emails")
def get_emails(
    status: str = "all",
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    query = db.query(Job).filter(Job.user_id == user_id)

    if status == "sent":
        query = query.filter(Job.status == "sent")
    elif status == "pending":
        query = query.filter(Job.status == "pending")

    jobs = query.order_by(Job.created_at.desc()).all()

    return [
        {
            "id": j.id,
            "message": j.message_text,
            "status": j.status,
            "created_at": j.created_at,
            "subject": j.generated_subject,
            "body": j.generated_body
        }
        for j in jobs
    ]