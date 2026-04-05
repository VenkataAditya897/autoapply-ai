from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import datetime
from app.models.base import Base

class ClassifiedMessage(Base):
    __tablename__ = "classified_messages"

    id = Column(Integer, primary_key=True)

    message_id = Column(Integer)  # telegram_message.id

    type = Column(String)

    emails = Column(ARRAY(String))
    phones = Column(ARRAY(String))
    links = Column(ARRAY(String))

    status = Column(String, default="pending")

    created_at = Column(DateTime, default=datetime.utcnow)