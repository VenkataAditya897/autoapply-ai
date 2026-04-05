from pydantic import BaseModel

class EducationCreate(BaseModel):
    college: str
    degree: str
    gpa: str
    start_year: str
    end_year: str