from app.core.db import SessionLocal
from app.models.job import Job
from app.queue import pop_job
from app.services.linkedin_processor import process_linkedin_job

import time

print("💼 LinkedIn Worker Started...")

while True:
    job_data = pop_job("linkedin")

    if not job_data:
        time.sleep(1)
        continue

    job_id = job_data["job_id"]
    db = SessionLocal()

    try:
        job = db.get(Job, job_id)

        if job:
            print(f"💼 Processing LinkedIn job {job_id}")

            process_linkedin_job(db, job, job.user_id)


    except Exception as e:
        print("❌ LinkedIn worker error:", e)

    finally:
        db.close()