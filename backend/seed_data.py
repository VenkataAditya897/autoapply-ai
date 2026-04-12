from app.core.db import SessionLocal
from app.models.user import User
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.experience import Experience
from app.models.project import Project
from app.models.education import Education
from app.models.certification import Certification
from app.core.security import hash_password

db = SessionLocal()

try:
    # ---------------- USER ----------------
    user = User(
        email="venkataaditya897@gmail.com",
        password=hash_password("aditya01")  # ✅ UPDATED
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # ---------------- PROFILE ----------------
    profile = Profile(
        user_id=user.id,
        first_name="Venkata",
        last_name="Aditya Gopalapuram",
        phone="8978057144",
        location="Hyderabad",
        linkedin="https://www.linkedin.com/in/venkata-aditya-gopalapuram-05442626a/",
        github="https://github.com/VenkataAditya897",
        total_experience="0 years 6 months"  # ✅ IMPORTANT
    )
    db.add(profile)

    # ---------------- SKILLS ----------------
    skills = [
        "Python", "Java", "C++", "JavaScript", "SQL", "HTML", "CSS",
        "FastAPI", "Flask", "React", "Node.js", "Express.js", "Laravel",
        "MySQL", "PostgreSQL", "MongoDB",
        "Docker", "Linux", "Git", "GitHub",
        "RAG", "LangChain", "CrewAI", "Prompt Engineering",
        "Vector Databases", "Pandas", "TensorFlow", "OpenCV",
        "REST APIs", "Microservices", "Automation",
        "API Design", "OOP", "DSA"
    ]

    for s in skills:
        db.add(Skill(user_id=user.id, name=s))

    # ---------------- EDUCATION ----------------
    edu = Education(
        user_id=user.id,
        college="Sreenidhi Institute of Science & Technology",
        degree="B.Tech",
        gpa="8.10 / 10.0",
        start_year="2021",
        end_year="2025"
    )
    db.add(edu)

    # ---------------- EXPERIENCE 1 ----------------
    exp1 = Experience(
        user_id=user.id,
        company="Tekisho Infotech Pvt Ltd",
        role="AI Innovation Associate Intern",
        start_date="2026-03",
        end_date="Present",
        description="""
Worked on Generative AI and Agentic AI systems using CrewAI and LangChain.
Built and tested multi-agent workflows and RAG pipelines.
Developed backend APIs and integrations for real-world AI applications.
Contributed to prompt engineering and vector database solutions.
"""
    )
    db.add(exp1)

    # ---------------- EXPERIENCE 2 ----------------
    exp2 = Experience(
        user_id=user.id,
        company="Smart Ecom Tech",
        role="Software Developer AI Intern",
        start_date="2025-09",
        end_date="2026-01",
        description="""
Built AI-powered backend systems using OpenAI and Gemini for image generation and automation.
Developed scalable APIs and automation pipelines using Python, Node.js, and Laravel.
Improved performance through batch processing, prompt optimization, and pipeline efficiency.
"""
    )
    db.add(exp2)

    # ---------------- PROJECTS ----------------
    # ---------------- PROJECTS ----------------
    projects = [
        Project(
            user_id=user.id,
            name="AutoApply AI – Telegram Job Outreach Agent",
            description="""
    Built an AI-powered system that monitors Telegram channels and generates personalized cold emails using LLMs.
    Implemented an asynchronous pipeline with Telethon for real-time message ingestion and automated outreach.
    Designed modular services for classification, parsing, and email automation.
    """,
            tech="Python, FastAPI, Telethon, Redis, LLMs"
        ),
        Project(
            user_id=user.id,
            name="Multi-Agent CRM Intake Automation System",
            description="""
    Developed a multi-agent system to process emails, PDFs, and structured data for CRM workflows.
    Used LangChain and LLMs for intelligent classification and agent orchestration.
    Implemented memory tracking and modular architecture for scalable automation.
    """,
            tech="LangChain, Flask, AI Agents"
        ),
        Project(
            user_id=user.id,
            name="AI-Powered E-commerce Automation Pipeline",
            description="""
    Built an automated backend pipeline to generate product content, images, and mockups using AI APIs.
    Designed a multi-service architecture orchestrating generation, mockup rendering, and publishing.
    Implemented scheduling and pipeline orchestration for end-to-end automation at scale.
    """,
            tech="Python, Node.js, PHP, Shopify API, AI APIs"
        )
    ]

    for p in projects:
        db.add(p)

    # ---------------- CERTIFICATIONS ----------------
    certs = [
        Certification(
            user_id=user.id,
            name="AWS Academy – Cloud Virtual Internship (EduSkills / AICTE)",
            year="2023"
        ),
        Certification(
            user_id=user.id,
            name="Bharat Intern – Machine Learning Virtual Internship",
            year="2023"
        )
    ]

    for c in certs:
        db.add(c)

    db.commit()

    print("✅ FULL RESUME SEEDED SUCCESSFULLY")

finally:
    db.close()