from app.core.db import SessionLocal
from app.models.job import Job
from app.services.email_processor import process_email_job

# ✅ create DB session
db = SessionLocal()

try:
    # get first email job
    job = db.query(Job).filter(Job.type == "email").first()

    if not job:
        print("❌ No email jobs found")
    else:
        result = process_email_job(db, job, user_id=1)
        print("\n✅ GENERATED EMAIL:\n")
        print(result)

finally:
    db.close()