from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate
from app.core.deps import get_current_user
from app.models.skill import Skill
from app.models.experience import Experience
from app.models.project import Project
from app.models.education import Education
from fastapi import UploadFile, File
import shutil
from app.models.job import Job
import os
os.makedirs("uploads", exist_ok=True)
router = APIRouter()

@router.post("/")
def create_or_update_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    existing = db.query(Profile).filter(Profile.user_id == user_id).first()

    if existing:
        # UPDATE
        for key, value in profile.dict().items():
            setattr(existing, key, value)

        db.commit()
        return {"message": "Profile updated"}

    else:
        # CREATE
        db_profile = Profile(**profile.dict(), user_id=user_id)
        db.add(db_profile)
        db.commit()
        return {"message": "Profile created"}
@router.get("/")
def get_profile(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    skills = db.query(Skill).filter(Skill.user_id == user_id).all()
    exp = db.query(Experience).filter(Experience.user_id == user_id).all()
    projects = db.query(Project).filter(Project.user_id == user_id).all()
    education = db.query(Education).filter(Education.user_id == user_id).all()

    return {
        "profile": profile,
        "skills": skills,
        "experience": exp,
        "projects": projects,
        "education": education
    }
@router.post("/upload-resume")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    file_path = f"uploads/{user_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    if profile:
        profile.resume_url = file_path
        db.commit()

    return {"url": file_path}


@router.get("/dashboard")
def dashboard_data(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    skills = db.query(Skill).filter(Skill.user_id == user_id).all()
    exp = db.query(Experience).filter(Experience.user_id == user_id).all()
    projects = db.query(Project).filter(Project.user_id == user_id).all()

    jobs = db.query(Job).filter(Job.user_id == user_id).order_by(Job.created_at.desc()).limit(5).all()

    # ✅ PROFILE COMPLETENESS LOGIC
    fields = [
        profile.first_name if profile else None,
        profile.last_name if profile else None,
        profile.phone if profile else None,
        profile.location if profile else None,
        profile.resume_url if profile else None,
    ]

    filled = sum(1 for f in fields if f)
    completeness = int((filled / len(fields)) * 100)

    return {
        "total_experience": profile.total_experience if profile else "0",
        "skills_count": len(skills),
        "profile_completeness": completeness,
        "recent_jobs": jobs
    }