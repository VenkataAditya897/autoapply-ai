from app.services.user_data import get_user_data
from app.services.context_builder import build_context
from app.services.email_generator import generate_email

def process_email_job(db, job, user_id):
    # 1️⃣ Fetch user data
    user_data = get_user_data(db, user_id)

    # 2️⃣ Build context
    context = build_context(user_data, job.message_text)

    # 3️⃣ Generate email
    email = generate_email(context, job.message_text)

    return email