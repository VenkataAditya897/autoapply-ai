from app.models.job import Job

def route_message(db, classified, telegram_msg):
    job = Job(
        user_id=telegram_msg.user_id,
        message_id=telegram_msg.id,
        type=classified.type,

        emails=classified.emails,
        phones=classified.phones,
        links=classified.links,

        message_text=telegram_msg.message_text
    )

    db.add(job)
    db.commit()