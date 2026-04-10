from pydantic import BaseModel

class CertificationCreate(BaseModel):
    name: str
    year: str | None = None