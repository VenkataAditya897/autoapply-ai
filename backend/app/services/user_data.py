def get_user_data(db, user_id):
    from app.models.profile import Profile
    from app.models.skill import Skill
    from app.models.project import Project
    from app.models.experience import Experience
    from app.models.user import User

    user = db.query(User).filter(User.id == user_id).first()
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    skills = db.query(Skill).filter(Skill.user_id == user_id).all()
    projects = db.query(Project).filter(Project.user_id == user_id).all()
    experience = db.query(Experience).filter(Experience.user_id == user_id).all()

    return {
        "email": user.email,
        "profile": profile,
        "skills": skills,
        "projects": projects,
        "experience": experience
    }