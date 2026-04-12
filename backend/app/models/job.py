from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import datetime
from app.models.base import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, nullable=True)
    message_id = Column(Integer, unique=True)

    type = Column(String)

    emails = Column(ARRAY(String))
    phones = Column(ARRAY(String))
    links = Column(ARRAY(String))

    message_text = Column(Text)
    generated_subject = Column(Text)
    generated_body = Column(Text)
    retry_count = Column(Integer, default=0)

    status = Column(String, default="pending")

    created_at = Column(DateTime, default=datetime.utcnow)