from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.base import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    location = Column(String)
    linkedin = Column(String)   # ✅ ADD
    github = Column(String)     # ✅ ADD
    total_experience = Column(String)
    resume_url = Column(String)