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
        password=hash_password("123456")
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
        github="https://github.com/VenkataAditya897"
    )
    db.add(profile)

    # ---------------- SKILLS ----------------
    skills = [
        # Languages
        "Python", "Java", "C++", "JavaScript", "SQL", "HTML", "CSS",

        # Frameworks
        "FastAPI", "Flask", "React", "Node.js", "Express.js", "Laravel",

        # Databases
        "MySQL", "PostgreSQL", "MongoDB",

        # DevOps
        "Docker", "Linux", "Git", "GitHub",

        # AI/ML
        "RAG", "LangChain", "CrewAI", "Prompt Engineering",
        "Vector Databases", "Pandas", "TensorFlow", "OpenCV",

        # Concepts
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
        gpa="8.10/10",
        start_year="2021",
        end_year="2025"
    )
    db.add(edu)

    # ---------------- EXPERIENCE 1 ----------------
    exp1 = Experience(
        user_id=user.id,
        company="Tekisho Infotech Pvt Ltd",
        role="AI Innovation Associate Intern",
        start_date="2021-12",
        end_date="2025-08",
        description="""
Worked on Generative AI and Agentic AI systems using CrewAI and LangChain.
Developed backend APIs and integrations for real-world AI applications.
Contributed to RAG pipelines, prompt engineering, and vector database solutions.
"""
    )
    db.add(exp1)

    # ---------------- EXPERIENCE 2 ----------------
    exp2 = Experience(
        user_id=user.id,
        company="Smart Ecom Tech",
        role="Software Developer AI Intern",
        start_date="2025-09",
        end_date="Present",
        description="""
Built AI backend systems using Python, OpenAI, and Gemini.
Developed scalable APIs, automation pipelines, and Shopline apps.
Worked on scraping, data processing, and Linux deployments.
Optimized AI pipelines using prompt engineering and batching.
"""
    )
    db.add(exp2)

    # ---------------- PROJECT 1 ----------------
    proj1 = Project(
        user_id=user.id,
        name="Secure Attendance System (QR + Face Recognition)",
        description="""
Flask-based system using QR and face recognition.
Used OpenCV and face_recognition for authentication.
Dashboard to track attendance and prevent proxy.
""",
        tech="Flask, OpenCV, Python"
    )
    db.add(proj1)

    # ---------------- PROJECT 2 ----------------
    proj2 = Project(
        user_id=user.id,
        name="Multi-Agent CRM Intake Automation",
        description="""
Multi-agent system using Flask and LangChain.
Processes emails, PDFs, and JSON automatically.
Implements routing, memory tracking, and logging.
""",
        tech="LangChain, Flask, AI Agents"
    )
    db.add(proj2)

    # ---------------- PROJECT 3 ----------------
    proj3 = Project(
        user_id=user.id,
        name="MedCare AI Healthcare Platform",
        description="""
AI health platform with Google Fit integration.
OCR + NLP for medical reports.
Multi-agent AI for insights.
Microservices using Flask and Node.js.
""",
        tech="Flask, Node.js, OCR, NLP"
    )
    db.add(proj3)

    # ---------------- CERTIFICATIONS ----------------
    cert1 = Certification(
        user_id=user.id,
        name="AWS Academy – Cloud Virtual Internship (EduSkills / AICTE)",
        year="2023"
    )

    cert2 = Certification(
        user_id=user.id,
        name="Bharat Intern – Machine Learning Virtual Internship",
        year="2023"
    )

    db.add(cert1)
    db.add(cert2)

    db.commit()

    print("✅ FULL RESUME DATA SEEDED SUCCESSFULLY")

finally:
    db.close()