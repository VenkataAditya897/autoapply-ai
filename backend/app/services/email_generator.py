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
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": "You generate professional job emails in JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,   # 🔥 more natural
        top_p=0.9
    )

    content = response.choices[0].message.content
    
    # print(f"""Name: {context['name']}
    #     Skills: {context['skills']}
    #     Projects: {context['projects']}
    #     Total Experience: {context['total_experience']}
    #     Experience: {context['experience']}""")

    try:
        return json.loads(content)
    except:
        return {
            "subject": "Application for Opportunity",
            "body": content
        }