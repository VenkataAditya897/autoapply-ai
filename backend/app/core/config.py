import os
from dotenv import load_dotenv

load_dotenv()

def get_env(key: str):
    value = os.getenv(key)
    if not value:
        raise ValueError(f"❌ Missing required env variable: {key}")
    return value

# ---------------- REQUIRED ----------------
DATABASE_URL = get_env("DATABASE_URL")
GROQ_API_KEY = get_env("GROQ_API_KEY")

TELEGRAM_API_ID = int(get_env("TELEGRAM_API_ID"))
TELEGRAM_API_HASH = get_env("TELEGRAM_API_HASH")