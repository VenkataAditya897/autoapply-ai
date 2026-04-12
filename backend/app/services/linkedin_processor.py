from app.services.user_data import get_user_data
from app.services.context_builder import build_context
from app.services.linkedin_generator import generate_linkedin_message
def extract_name_from_link(links):
    if not links:
        return None

    for link in links:
        if "linkedin.com/in/" in link:
            try:
                slug = link.split("/in/")[1].split("/")[0]
                name = slug.replace("-", " ").title()
                return name
            except:
                return None
    return None

def process_linkedin_job(db, job, user_id):
    try:
        # ✅ SAME AS EMAIL
        user_data = get_user_data(db, user_id)

        context = build_context(user_data, job.message_text)
        name = extract_name_from_link(job.links)


        message = generate_linkedin_message(context, job.message_text,name)

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