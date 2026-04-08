from fastapi import FastAPI
from app.routes import auth, profile
from app.models import user_channel
# 👇 IMPORTANT
from app.models.base import Base
from app.core.db import engine
from fastapi.middleware.cors import CORSMiddleware
# import all models so SQLAlchemy sees them
from app.models import user, profile as profile_model
from app.routes import profile_details
from app.models import telegram_message
from app.models import skill, experience, project, education
from app.models import classified_message
from app.models import certification
from app.models import job
from app.routes import telegram
from app.routes import analytics
from app.models import google_account
from app.routes import google_auth

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 👇 CREATE ALL TABLES HERE
Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth")
app.include_router(profile.router, prefix="/profile")
app.include_router(profile_details.router, prefix="/profile")
app.include_router(telegram.router, prefix="/telegram")
app.include_router(analytics.router, prefix="/analytics")
app.include_router(google_auth.router, prefix="/auth")

@app.get("/health")
def health_check():
    return {"status": "ok"}