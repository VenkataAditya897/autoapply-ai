@echo off

echo 🚀 Starting AutoApply AI...
echo 🔹 Activating virtual environment...

call venv\Scripts\activate

cd backend


echo 🔹 Starting FastAPI server...
start cmd /k uvicorn app.main:app --reload

echo 🔹 Starting Email Worker...
start cmd /k python worker_email.py

echo ✅ All services started!
pause