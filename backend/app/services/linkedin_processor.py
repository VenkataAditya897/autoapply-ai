from app.services.user_data import get_user_data
from app.services.context_builder import build_context
from app.services.linkedin_generator import generate_linkedin_message


def process_linkedin_job(db, job, user_id):
    try:
        # ✅ SAME AS EMAIL
        user_data = get_user_data(db, user_id)

        context = build_context(user_data, job.message_text)

        message = generate_linkedin_message(context, job.message_text)

        # ✅ STORE IN DB
        job.linkedin_message = message
        job.status = "pending"

        db.commit()
        print(f"💼 LinkedIn message generated (pending)")

        return True

    except Exception as e:
        print("ERROR:", e)
        job.status = "pending"
        db.commit()
        return None