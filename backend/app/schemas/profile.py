from pydantic import BaseModel
from typing import Optional

class ProfileCreate(BaseModel):
    first_name: str
    last_name: str
    phone: str
    location: str
    linkedin: Optional[str] = None
    github: Optional[str] = None