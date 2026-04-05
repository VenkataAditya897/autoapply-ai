from sqlalchemy import Column, Integer, String
from app.models.base import Base

class UserChannel(Base):
    __tablename__ = "user_channels"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    channel_name = Column(String)