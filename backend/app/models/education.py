from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.base import Base

class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    college = Column(String)
    degree = Column(String)
    gpa = Column(String)
    start_year = Column(String)
    end_year = Column(String)