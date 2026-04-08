import redis
import json
from app.core.db import SessionLocal
from app.models.job import Job
from app.services.email_processor import process_email_job

r = redis.Redis(host="localhost", port=6379, db=0)

print("📧 Email Worker Started...")

while True:
    data = r.brpop("email_queue")

    if data:
        job_data = json.loads(data[1])
        job_id = job_data["job_id"]

        db = SessionLocal()

        try:
            job = db.get(Job, job_id)

            if job:
                print(f"📤 Processing job {job_id}")
                process_email_job(db, job, job.user_id)

        except Exception as e:
            print("❌ Email worker error:", e)

        finally:
            db.close()