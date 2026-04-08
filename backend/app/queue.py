import redis
import json

r = redis.Redis(host="localhost", port=6379, db=0)

def push_job(job_id):
    r.lpush("email_queue", json.dumps({"job_id": job_id}))