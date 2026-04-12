
from app.core.db import SessionLocal
from app.models.job import Job
from app.services.email_processor import process_email_job
from app.queue import pop_job, push_job
import time
print("📧 Email Worker Started...")

while True:
    job_data = pop_job("email")

    if not job_data:
        time.sleep(1)
        continue

    job_id = job_data["job_id"]

    db = SessionLocal()

    try:
        job = db.get(Job, job_id)

        if job:
            print(f"📤 Processing job {job_id}")

            success = process_email_job(db, job, job.user_id)

            if success:
                print(f"✅ Job {job.id} completed")
                job.status = "sent"
            else:
                job.retry_count = (job.retry_count or 0) + 1

                if job.retry_count < 3:
                    print(f"🔁 Retrying job {job.id}")

                    push_job({
                        "job_id": job.id,
                        "type": "email"
                    })
                else:
                    print(f"❌ Job {job.id} failed")

            db.commit()

    except Exception as e:
        print("❌ Email worker error:", e)

    finally:
        db.close()