@echo off

echo 🚀 Starting AutoApply AI...

:: Activate venv
echo 🔹 Activating virtual environment...
call venv\Scripts\activate

:: ================= BACKEND =================
cd backend

echo 🔹 Starting FastAPI server...
start cmd /k uvicorn app.main:app --reload

echo 🔹 Starting Email Worker...
start cmd /k python worker_email.py

echo 🔹 Starting LinkedIn Worker...
start cmd /k python worker_linkedin.py

@REM echo 🔹 Starting Telegram Worker...
@REM start cmd /k python worker_telegram.py
start cmd /k python process_today_jobs.py

:: ================= FRONTEND =================
cd ..
cd frontend

echo 🔹 Starting Frontend (Next.js)...
start cmd /k npm run dev

echo ✅ All services started!
pause