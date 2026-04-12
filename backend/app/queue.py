import redis
import json

import os
from dotenv import load_dotenv
load_dotenv()
redis_client = redis.Redis.from_url(os.getenv("REDIS_URL"))


def push_job(job):
    queue_name = f"jobs:{job['type']}"
    redis_client.lpush(queue_name, json.dumps(job))


def pop_job(job_type):
    queue_name = f"jobs:{job_type}"
    job = redis_client.rpop(queue_name)

    if job:
        return json.loads(job)
    return None