from app.models.job import Job
from app.services.linkedin_generator import generate_linkedin_message

def route_message(db, classified, telegram_msg):
    existing = db.query(Job).filter_by(message_id=telegram_msg.id).first()

    if existing:
        return existing
    job = Job(
        user_id=telegram_msg.user_id,
        message_id=telegram_msg.id,
        type=classified.type,
        emails=classified.emails,
        phones=classified.phones,
        links=classified.links,
        message_text=telegram_msg.message_text
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job  # ✅ IMPORTANT