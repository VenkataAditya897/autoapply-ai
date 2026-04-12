import re

EMAIL_REGEX = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
PHONE_REGEX = r"\b(?:\+91[\-\s]?)?[6-9]\d{9}\b"
LINK_REGEX = r"https?://[^\s]+"

GOOGLE_FORM_KEYWORDS = [
    "docs.google.com/forms",
    "forms.gle"
]

def classify_message(text: str):
    emails = re.findall(EMAIL_REGEX, text)
    phones = re.findall(PHONE_REGEX, text)
    links = re.findall(LINK_REGEX, text)
    phones = [p for p in phones if not any(p in link for link in links)]


    has_google_form = any(g in text for g in GOOGLE_FORM_KEYWORDS)
    has_linkedin = any("linkedin.com" in l or "lnkd.in" in l for l in links)


    # ---------------- TYPE LOGIC ----------------
    if emails:
        msg_type = "email"
    elif phones:
        msg_type = "phone"
    elif has_google_form:
        msg_type = "google_form"
    elif has_linkedin:
        msg_type = "linkedin" 
    elif links:
        msg_type = "link"
    else:
        msg_type = "unknown"

    return {
        "type": msg_type,
        "emails": list(set(emails)),
        "phones": list(set(phones)),
        "links": list(set(links)),
        "has_google_form": has_google_form
    }