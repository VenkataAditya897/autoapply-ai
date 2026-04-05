from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import hash_password, verify_password, create_access_token
from sqlalchemy.exc import IntegrityError
from app.models.profile import Profile  # ADD THIS IMPORT

router = APIRouter()

# ---------------- REGISTER ----------------
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # check if email already exists
        existing = db.query(User).filter(User.email == user.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed = hash_password(user.password)
        db_user = User(email=user.email, password=hashed)

        db.add(db_user)
        db.commit()

        return {"message": "User created"}

    except HTTPException:
        raise

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))  # optional for debugging


# ---------------- LOGIN ----------------

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == user.email).first()

        if not db_user:
            raise HTTPException(status_code=400, detail="User not found")

        if not verify_password(user.password, db_user.password):
            raise HTTPException(status_code=400, detail="Incorrect password")

        token = create_access_token({"user_id": db_user.id})

        # 🔥 NEW: check profile
        profile = db.query(Profile).filter(Profile.user_id == db_user.id).first()

        return {
            "access_token": token,
            "has_profile": profile is not None
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(status_code=500, detail="Login failed")