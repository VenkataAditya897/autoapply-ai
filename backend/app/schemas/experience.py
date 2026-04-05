from pydantic import BaseModel

class ExperienceCreate(BaseModel):
    company: str
    role: str
    start_date: str
    end_date: str
    description: str