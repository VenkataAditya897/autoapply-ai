import base64
import requests
import os
from app.models.google_account import GoogleAccount

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")


# ---------------- REFRESH TOKEN ----------------
def refresh_access_token(refresh_token):
    url = "https://oauth2.googleapis.com/token"

    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token"
    }

    res = requests.post(url, data=data).json()

    return res.get("access_token")


# ---------------- SEND EMAIL ----------------
def send_email(db, user_id, to_email, subject, body, attachment_path=None):
    acc = db.query(GoogleAccount).filter_by(user_id=user_id).first()

    if not acc:
        print("❌ Gmail not connected")
        return False

    access_token = acc.access_token

    # 🔥 TRY NORMAL SEND
    success = _send_with_token(access_token, acc.email, to_email, subject, body, attachment_path)

    # 🔥 IF FAILED → REFRESH TOKEN
    if not success and acc.refresh_token:
        print("🔄 Refreshing token...")

        new_token = refresh_access_token(acc.refresh_token)

        if not new_token:
            print("❌ Failed to refresh token")
            return False

        acc.access_token = new_token
        db.commit()

        # retry
        return _send_with_token(new_token, acc.email, to_email, subject, body, attachment_path)

    return success


# ---------------- INTERNAL SEND ----------------
def _send_with_token(access_token, from_email, to_email, subject, body, attachment_path):
    if attachment_path:
        raw_message = build_mime_message(from_email, to_email, subject, body, attachment_path)
    else:
        message = f"""From: {from_email}
To: {to_email}
Subject: {subject}

{body}
"""
        raw_message = base64.urlsafe_b64encode(message.encode()).decode()

    url = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    res = requests.post(url, headers=headers, json={"raw": raw_message})

    return res.status_code == 200


# ---------------- ATTACHMENT SUPPORT ----------------
def build_mime_message(from_email, to_email, subject, body, file_path):
    import mimetypes

    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"

    mime_type, _ = mimetypes.guess_type(file_path)
    mime_type = mime_type or "application/octet-stream"

    with open(file_path, "rb") as f:
        file_data = f.read()

    encoded_file = base64.b64encode(file_data).decode()

    message = f"""From: {from_email}
To: {to_email}
Subject: {subject}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="{boundary}"

--{boundary}
Content-Type: text/plain; charset="UTF-8"

{body}

--{boundary}
Content-Type: {mime_type}
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="{file_path.split('/')[-1]}"

{encoded_file}

--{boundary}--
"""

    return base64.urlsafe_b64encode(message.encode()).decode()