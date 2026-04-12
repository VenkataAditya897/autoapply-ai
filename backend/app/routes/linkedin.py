from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.services.linkedin_generator import generate_linkedin_message

router = APIRouter()

@router.post("/generate-linkedin")
def generate_linkedin(job_text: str, db: Session = Depends(get_db)):
    message = generate_linkedin_message(job_text)

    return {
        "status": "success",
        "message": message
    }