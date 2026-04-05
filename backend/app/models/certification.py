from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.base import Base

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    name = Column(String)
    year = Column(String)