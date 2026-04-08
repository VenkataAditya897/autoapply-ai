from sqlalchemy import Column, Integer, String
from app.models.base import Base

class GoogleAccount(Base):
    __tablename__ = "google_accounts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)

    email = Column(String)
    access_token = Column(String)
    refresh_token = Column(String)