import re

EMAIL_REGEX = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
PHONE_REGEX = r"\+?\d[\d\s\-]{8,15}\d"
LINK_REGEX = r"https?://[^\s]+"

GOOGLE_FORM_KEYWORDS = [
    "docs.google.com/forms",
    "forms.gle"
]

def classify_message(text: str):
    emails = re.findall(EMAIL_REGEX, text)
    phones = re.findall(PHONE_REGEX, text)
    links = re.findall(LINK_REGEX, text)

    has_google_form = any(g in text for g in GOOGLE_FORM_KEYWORDS)

    # ---------------- TYPE LOGIC ----------------
    if emails:
        msg_type = "email"
    elif phones:
        msg_type = "phone"
    elif has_google_form:
        msg_type = "google_form"
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