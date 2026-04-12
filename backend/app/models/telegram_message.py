from sqlalchemy import Column, Integer, Text, DateTime,String
from sqlalchemy.dialects.postgresql import JSON
from datetime import datetime
from app.models.base import Base

class TelegramMessage(Base):
    __tablename__ = "telegram_messages"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=True)

    message_text = Column(Text)
    source = Column(String)
    raw_data = Column(JSON)  # ✅ IMPORTANT CHANGE
    telegram_id = Column(Integer, unique=True, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)