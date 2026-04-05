from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.base import Base

class Experience(Base):
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    company = Column(String)
    role = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    description = Column(String)