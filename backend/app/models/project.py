from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.base import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    name = Column(String)
    description = Column(String)
    tech = Column(String)  # comma-separated for now