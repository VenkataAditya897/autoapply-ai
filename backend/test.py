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

    # 🔥 trim context (IMPORTANT)
    context["experience"] = context["experience"][:800]
    context["projects"] = context["projects"][:400]

    prompt = f"""
Write a professional job application email.

Return STRICT JSON:
{{
  "subject": "...",
  "body": "..."
}}

RULES:
- Natural human tone
- 110–140 words
- 3–4 short paragraphs using \\n\\n
- No location (city/country)
- No "I am excited to apply"
- No fake metrics or exaggeration
- Clear, simple English

CONTENT:
Name: {context['name']}
Skills: {context['skills']}
Experience: {context['experience']}
Total Experience: {context['total_experience']}

JOB:
{job_text}

JOB MATCHING:
- Compare job role with candidate experience

IF related:
  → Use specific tools + real work (e.g., FastAPI, LangChain, APIs)

IF NOT related:
  → Do NOT fake experience
  → Do NOT mention irrelevant tools
  → Focus on transferable skills, learning, and problem-solving

REQUIREMENTS:
- Mention tools ONLY if relevant to the job
- Include at least 1 real task (APIs, pipelines, automation, etc.)
- Keep it concise, no long explanations

SUBJECT:
- "Application for [Role]" (add location only if explicitly required)

FORMAT:

Dear Hiring Manager,\\n\\n
I’m Venkata Aditya Gopalapuram, currently working as an AI Innovation Associate Intern with hands-on experience in Python and Generative AI systems.\\n\\n
During my internships at Tekisho Infotech and Smart Ecom Tech, I’ve worked on RAG pipelines using LangChain and built scalable backend APIs with FastAPI, Node.js, and Laravel. I’ve also developed automation pipelines and AI-driven systems using OpenAI and Gemini for real-world applications.\\n\\n
I’m interested in this role as it focuses on practical AI development, which aligns closely with the work I’ve been doing and want to continue growing in.\\n\\n
Thank you for your time and consideration.\\n\\n
Regards,\\n
{context['name']}

OUTPUT:
Only JSON. No explanation.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",  # 🔥 better writing
        messages=[
            {"role": "system", "content": "You generate professional job emails in JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,   # 🔥 more natural
        top_p=0.9
    )

    content = response.choices[0].message.content

    print("\n🔍 RAW MODEL OUTPUT:\n")
    print(content)

    try:
        parsed = json.loads(content)
    except:
        print("\n⚠ JSON failed, fallback used\n")
        parsed = {
            "subject": "Application for Role",
            "body": content
        }

    return parsed


# ✅ TEST DATA (your real data)

context = {
    "name": "Venkata Aditya Gopalapuram",
    "email": "spidyaditya@gmail.com",
    "skills": "Python, FastAPI, LangChain, RAG, Node.js, AI, APIs",
    "projects": "",
    "total_experience": "0 years 5 months",
    "experience": """Software Developer AI Intern at Smart Ecom Tech
Built AI backend systems using OpenAI and Gemini.
Developed APIs and automation pipelines using Python and Node.js.

AI Innovation Associate Intern at Tekisho Infotech
Worked on RAG pipelines and multi-agent systems using LangChain and CrewAI."""
}

job_text = """
UI/UX Designer (4+ Years Experience)

Location: Bangalore / Remote (India)
Experience: 4+ Years
Employment Type: Full-time

How to Apply:
Send your resume and portfolio to spidyaditya@gmail.com

About the Role

We are looking for an experienced UI/UX Designer with 4+ years of hands-on experience in designing intuitive and user-centric digital products. You will work closely with product managers, developers, and stakeholders to create seamless user experiences across web and mobile platforms.
"""

# ✅ RUN TEST
result = generate_email(context, job_text)

print("\n✅ FINAL OUTPUT:\n")
print("SUBJECT:", result["subject"])
print("\nBODY:\n", result["body"])