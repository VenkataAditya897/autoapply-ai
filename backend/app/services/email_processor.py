from app.services.user_data import get_user_data
from app.services.context_builder import build_context
from app.services.email_generator import generate_email
from app.services.email_sender import send_email

def process_email_job(db, job, user_id):
    try:
        user_data = get_user_data(db, user_id)

        context = build_context(user_data, job.message_text)

        email = generate_email(context, job.message_text)

        subject = email.get("subject")
        body = email.get("body")

        # ✅ SEND EMAIL
        if job.emails and len(job.emails) > 0:
            profile = user_data.get("profile")
            resume_path = profile.resume_url if profile else None

            success = send_email(
                db,
                user_id,
                job.emails[0],
                subject,
                body,
                attachment_path=resume_path
            )
        else:
            success = False

        # ✅ UPDATE STATUS
        if success:
            job.status = "sent"
        else:
            job.status = "pending"

        job.generated_subject = subject
        job.generated_body = body

        db.commit()

        return email

    except Exception as e:
        print("ERROR:", e)
        job.status = "pending"
        db.commit()
        return None