import redis
import json

import os
r = redis.Redis.from_url(os.getenv("REDIS_URL"))
def push_job(job_id):
    r.lpush("email_queue", json.dumps({"job_id": job_id}))