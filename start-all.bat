@echo off
TITLE Launch OMEGA Stationery Full Stack
echo ==========================================================
echo    Launching OMEGA Stationery (Backend + Frontend)
echo ==========================================================
cd /d "%~dp0"
set "PATH=C:\Users\Hp\AppData\Local\Programs\nodejs;%PATH%"

echo Starting Node.js Backend on http://localhost:5000 ...
start "OMEGA Backend (Port 5000)" cmd /k "cd /d %~dp0 && set PATH=C:\Users\Hp\AppData\Local\Programs\nodejs;%%PATH%% && node server/server.mjs"

timeout /t 2 /nobreak >nul

echo Starting Vite Frontend on http://localhost:3000 ...
start "OMEGA Frontend (Port 3000)" cmd /k "cd /d %~dp0 && set PATH=C:\Users\Hp\AppData\Local\Programs\nodejs;%%PATH%% && npm run dev"

timeout /t 3 /nobreak >nul
start http://localhost:3000

echo Both servers launched!

