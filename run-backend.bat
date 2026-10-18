@echo off
TITLE OMEGA Stationery - High-Performance MongoDB & AI Backend
echo ==========================================================
echo    Launching OMEGA Stationery High-Performance Backend
echo    Port: 5000 ^| Node.js ^| MongoDB Atlas ^| Redis ^| AI Engine
echo ==========================================================
cd /d "%~dp0"
node server/server.mjs
pause
