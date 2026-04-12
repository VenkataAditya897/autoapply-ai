from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.deps import get_current_user
from app.models.telegram_message import TelegramMessage
from app.models.classified_message import ClassifiedMessage
from app.models.job import Job
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models.profile import Profile  # ✅ ADD THIS


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
    
    links_sent = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "link")\
        .filter(Job.status == "sent")\
        .count()

    # ---------------- GOOGLE FORMS ----------------
    forms_pending = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "google_form")\
        .count()
    forms_sent = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "google_form")\
        .filter(Job.status == "sent")\
        .count()

    # ---------------- PHONE ----------------
    phones_pending = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "phone")\
        .count()

    phones_sent = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "phone")\
        .filter(Job.status == "sent")\
        .count()
    # ---------------- TOTAL ----------------
    total_jobs = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .count()
    # ---------------- EMAIL TOTAL ----------------
    email_total = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "email")\
        .count()

    # ---------------- LINKS TOTAL ----------------
    links_total = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "link")\
        .count()

    # ---------------- FORMS TOTAL ----------------
    forms_total = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "google_form")\
        .count()

    # ---------------- PHONES TOTAL ----------------
    phones_total = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "phone")\
        .count()
    # ---------------- LINKEDIN ----------------
    linkedin_sent = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "linkedin")\
        .filter(Job.status == "sent")\
        .count()

    linkedin_total = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "linkedin")\
        .count()

    return {
        "total_jobs": total_jobs,

        "emails": {
            "sent": email_sent,
            "total": email_total
        },

        "links": {
            "sent": links_sent,
            "total": links_total
        },

        "forms": {
            "sent": forms_sent,
            "total": forms_total
        },

        "phones": {
            "sent": phones_sent,
            "total": phones_total
        },
        "linkedin": {   # ✅ ADD THIS
            "sent": linkedin_sent,
            "total": linkedin_total
        }
    }
@router.get("/emails")
def get_emails(
    status: str = "all",
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    query = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type == "email")   # ✅ ADD THIS

    if status == "sent":
        query = query.filter(Job.status == "sent")
    elif status == "pending":
        query = query.filter(Job.status == "pending")

    jobs = query.order_by(Job.created_at.desc()).all()
     # ✅ GET USER RESUME ONCE
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    resume = profile.resume_url if profile else None

    return [
        {
            "id": j.id,
            "message": j.message_text,
            "status": j.status,
            "created_at": j.created_at,
            "subject": j.generated_subject,
            "body": j.generated_body,
            "emails": j.emails,
            "attachment_path": resume
        }
        for j in jobs
    ]
@router.get("/others")
def get_others(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    jobs = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .filter(Job.type != "email")\
        .order_by(Job.created_at.desc())\
        .all()

    return [
        {
            "id": j.id,
            "type": j.type,              # ✅ IMPORTANT
            "message": j.message_text,
            "phones": j.phones,
            "links": j.links,
            "emails": j.emails,
            "status": j.status,
            "linkedin_message": j.linkedin_message
        }
        for j in jobs
    ]

@router.post("/complete/{job_id}")
def mark_complete(
    job_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == user_id
    ).first()

    if not job:
        return {"error": "Job not found"}

    job.status = "sent"   # ✅ reuse same logic
    db.commit()

    return {"message": "completed"}