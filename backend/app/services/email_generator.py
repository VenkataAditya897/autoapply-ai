from groq import Groq
import os
import json
from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment")

client = Groq(api_key=GROQ_API_KEY)

def generate_email(context, job_text):
    prompt = f"""
You are a professional job application email writer.

Generate a HIGH-QUALITY, NATURAL job application email.

Return STRICT JSON:
{{
  "subject": "...",
  "body": "..."
}}

-------------------------
TONE ADAPTATION (VERY IMPORTANT)

Adjust tone BASED ON EXPERIENCE:

- If experience is LOW / Fresher:
  → Simple, learning-focused, slightly humble

- If experience is MID (1–3 years):
  → Practical, confident, shows contribution

- If experience is HIGH (3+ years):
  → Professional, impact-focused, no beginner tone

DO NOT use the same tone for all.

-------------------------
WRITING STYLE (STRICT)

- Natural human tone (not AI-like)
- Clear and simple English
- No buzzwords (avoid: "leveraged", "synergy", "cutting-edge")
- No overconfidence
- No exaggeration
- No unnecessary lines

-------------------------
STRICT RULES

- DO NOT use:
  "I am excited to apply"
  "I am confident that I am a strong fit"

- DO NOT write robotic lines like:
  "My resume has been sent"

- Keep it 100–150 words
- 3–4 short paragraphs
- Use \\n\\n for spacing

-------------------------
EMAIL STRUCTURE

1. Greeting

2. Intro:
- Role + who you are

3. Experience:
- Relevant work (based on level)

4. Interest:
- Why this role

5. Closing:
Thank you for your time and consideration.

Regards,
{context['name']}
-------------------------
PERSONALIZATION (IMPORTANT)

- If recruiter name is present → use it
- Otherwise → Dear Hiring Manager

-------------------------
CONTENT

Name: {context['name']}
Email: {context['email']}
Skills: {context['skills']}
Projects: {context['projects']}
Experience: {context['experience']}
Total Experience: {context['total_experience']}

JOB:
{job_text}

-------------------------
OUTPUT:
Only JSON. No explanation.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You generate professional job emails in JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    content = response.choices[0].message.content
    if os.getenv("DEBUG"):
        print(f"""Name: {context['name']}
        Email: {context['email']}
        Skills: {context['skills']}
        Projects: {context['projects']}
        Total Experience: {context['total_experience']}
        Experience: {context['experience']}""")

    try:
        return json.loads(content)
    except:
        return {
            "subject": "Application for Opportunity",
            "body": content
        }