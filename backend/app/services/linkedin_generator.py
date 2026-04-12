from groq import Groq
import os
from dotenv import load_dotenv
from app.services.context_builder import build_context

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment")

client = Groq(api_key=GROQ_API_KEY)


def generate_linkedin_message(job_text):
    context = build_context()

    prompt = f"""
Write a SHORT LinkedIn message for a job application.

RULES:
- Max 4 lines
- No subject
- No "Dear Hiring Manager"
- Start with "Hi" or "Hi [Name]"
- Friendly + confident tone
- No long paragraphs
- Mention 1 real skill/project only

CANDIDATE:
Name: {context['name']}
Skills: {context['skills']}
Experience: {context['experience']}

JOB:
{job_text}

OUTPUT:
Only the message text. No JSON. No explanation.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": "You write short LinkedIn job outreach messages."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        top_p=0.9
    )

    return response.choices[0].message.content.strip()