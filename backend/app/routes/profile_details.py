from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.deps import get_current_user

from app.models.skill import Skill
from app.models.experience import Experience
from app.models.project import Project
from app.models.education import Education

from app.schemas.skill import SkillCreate
from app.schemas.experience import ExperienceCreate
from app.schemas.project import ProjectCreate
from app.schemas.education import EducationCreate
from app.models.certification import Certification
from app.schemas.certification import CertificationCreate

from app.services.context_builder import calculate_total_experience
from app.models.profile import Profile
router = APIRouter()

# ---------------- SKILLS ----------------
@router.post("/skills")
def add_skill(skill: SkillCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    db_skill = Skill(user_id=user_id, name=skill.name)
    db.add(db_skill)
    db.commit()
    return {"message": "Skill added"}

# ---------------- EXPERIENCE ----------------
from app.services.context_builder import calculate_total_experience
from app.models.profile import Profile

@router.post("/experience")
def add_experience(exp: ExperienceCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    db_exp = Experience(**exp.dict(), user_id=user_id)
    db.add(db_exp)
    db.commit()

    # ✅ UPDATE TOTAL EXPERIENCE
    all_exp = db.query(Experience).filter(Experience.user_id == user_id).all()

    _, total_exp_text = calculate_total_experience(all_exp)

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile:
        profile.total_experience = total_exp_text
        db.commit()

    return {"message": "Experience added"}
# ---------------- PROJECTS ----------------
@router.post("/projects")
def add_project(proj: ProjectCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    db_proj = Project(**proj.dict(), user_id=user_id)
    db.add(db_proj)
    db.commit()
    return {"message": "Project added"}

# ---------------- EDUCATION ----------------
@router.post("/education")
def add_education(edu: EducationCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    db_edu = Education(**edu.dict(), user_id=user_id)
    db.add(db_edu)
    db.commit()
    return {"message": "Education added"}

@router.post("/certifications")
def add_certification(
    cert: CertificationCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    db_cert = Certification(
        user_id=user_id,
        name=cert.name,
        year=cert.year
    )

    db.add(db_cert)
    db.commit()

    return {"message": "Certification added"}