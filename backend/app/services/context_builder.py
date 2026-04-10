from datetime import datetime

def calculate_total_experience(experiences):
    total_months = 0

    for exp in experiences:
        try:
            if len(exp.start_date) == 4:
                start = datetime.strptime(exp.start_date, "%Y")
            else:
                start = datetime.strptime(exp.start_date, "%Y-%m")

            if exp.end_date.lower() == "present":
                end = datetime.now()
            elif len(exp.end_date) == 4:
                end = datetime.strptime(exp.end_date, "%Y")
            else:
                end = datetime.strptime(exp.end_date, "%Y-%m")

            months = (end.year - start.year) * 12 + (end.month - start.month)
            total_months += max(months, 0)

        except:
            continue

    years = total_months // 12
    months = total_months % 12

    return total_months, f"{years} years {months} months"


def build_context(user_data, job_text: str):
    job_text_lower = job_text.lower()

    profile = user_data.get("profile")
    if not profile:
        raise ValueError("User profile not found")

    # ✅ ALL SKILLS
    all_skills = [skill.name for skill in user_data["skills"]]

    # ---------------- PROJECT SCORING ----------------
    scored_projects = []
    for project in user_data["projects"]:
        job_words = set(job_text_lower.split())

        score = sum(
            1 for word in job_words
            if len(word) > 3 and word in project.description.lower()
        )
        scored_projects.append((score, project))

    top_projects = sorted(scored_projects, key=lambda x: x[0], reverse=True)[:5]

    project_list = [
        f"{p.name} ({p.tech})"
        for _, p in top_projects
    ]

    # ---------------- EXPERIENCE SCORING ----------------
    scored_experience = []
    for exp in user_data["experience"]:
        job_words = set(job_text_lower.split())

        score = sum(
            1 for word in job_words
            if len(word) > 3 and word in exp.description.lower()
        )
        scored_experience.append((score, exp))

    top_experience = sorted(scored_experience, key=lambda x: x[0], reverse=True)[:5]

    experience_list = []
    for _, exp in top_experience:
        exp_text = (
            f"{exp.role} at {exp.company} "
            f"({exp.start_date} to {exp.end_date})\n"
            f"{exp.description.strip()}"
        )
        experience_list.append(exp_text)

    # ✅ TOTAL EXPERIENCE
    total_months, total_exp_text = calculate_total_experience(user_data["experience"])

    return {
        "name": profile.first_name + " " + (profile.last_name or ""),
        "email": user_data["email"],
        "linkedin": profile.linkedin or "",
        "github": profile.github or "",

        "skills": ", ".join(all_skills),
        "projects": "\n".join(project_list),
        "experience": "\n\n".join(experience_list),
        "total_experience": total_exp_text,
        "total_experience_months": total_months
    }