import redis
import json
import time

from app.core.db import SessionLocal
from app.models.job import Job
from app.services.email_processor import process_email_job
from app.core.logger import logger

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

                success = process_email_job(db, job, job.user_id)

                if success:
                    print(f"✅ Job {job.id} completed")

                else:
                    job.retry_count = (job.retry_count or 0) + 1

                    if job.retry_count < 3:
                        print(f"🔁 Retrying job {job.id} (attempt {job.retry_count})")

                        time.sleep(2)  # 🔥 delay before retry
                        r.lpush("email_queue", json.dumps({"job_id": job.id}))

                    else:
                        print(f"❌ Job {job.id} failed permanently")

                    db.commit()

        except Exception as e:
            print("❌ Email worker error:", e)

        finally:
            db.close()
            time.sleep(1)  # global rate limit