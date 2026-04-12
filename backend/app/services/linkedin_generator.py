from groq import Groq
import os
from dotenv import load_dotenv
from app.services.context_builder import build_context

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment")

client = Groq(api_key=GROQ_API_KEY)

def generate_linkedin_message(context, job_text, name=None):
    prompt = f"""
Write a concise LinkedIn outreach message for a job opportunity.

GREETING RULE:
- If a clean first name is provided → use ONLY the first name (e.g., "Hi Abhishek,")
- If the name looks invalid or contains numbers → ignore it and use "Hi,"
- Never use full names or usernames
- There will never be any number of special characters in name use only one name from the persons name thats it

STRICT FORMAT (follow exactly):

Hi [senders name]

I came across your post regarding the [role]. I have experience in [relevant skills/tools] and have worked on [1 specific real task or project]. I would be interested in exploring this opportunity.

Here is my LinkedIn profile:
{context['linkedin']}

Here is my GitHub:
{context['github']}

Thanks  
{context['name']}

RULES:
- 5–6 lines total (including spacing)
- Natural, human tone (not robotic)
- DO NOT exaggerate experience
- Mention only 1–2 relevant skills/tools
- Mention 1 real task (APIs, backend, automation, etc.)
- If job is not strongly related → keep it general and honest
- DO NOT include emojis
- DO NOT include subject line
- DO NOT include "Dear Hiring Manager"

CANDIDATE:
Name: {context['name']}
Skills: {context['skills']}
Experience: {context['experience']}

JOB:
{job_text}

OUTPUT:
Only the final message text. No explanation.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": "You write structured LinkedIn outreach messages."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
        top_p=0.9
    )

    return response.choices[0].message.content.strip()