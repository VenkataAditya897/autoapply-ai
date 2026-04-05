from sqlalchemy import Column, Integer, String, Boolean
from app.models.base import Base

class TelegramAccount(Base):
    __tablename__ = "telegram_accounts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)

    phone = Column(String)
    session_name = Column(String)

    is_connected = Column(Boolean, default=False)
    is_running = Column(Boolean, default=False)