from pydantic import BaseModel

class ProjectCreate(BaseModel):
    name: str
    description: str
    tech: str