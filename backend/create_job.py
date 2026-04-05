from app.core.db import SessionLocal
from app.models.job import Job

db = SessionLocal()

try:
    job = Job(
        user_id=1,
        type="email",
        emails=["hr@company.com"],
        message_text="""
We are hiring a Python Developer with experience in FastAPI, AI systems, and backend development.
Send your resume to hr@company.com
"""
    )

    db.add(job)
    db.commit()

    print("✅ Job created")

finally:
    db.close()