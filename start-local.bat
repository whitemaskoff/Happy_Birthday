@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install it from https://nodejs.org then run this again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing packages...
  call npm install
)
echo.
echo Open these in your browser:
echo   Gift:  http://localhost:5173
echo   Admin: http://localhost:5173/admin   PIN 2036
echo.
start "" "http://localhost:5173"
call npm run dev
