@echo off
TITLE OMEGA Stationery - Web Storefront (Port 3000)
echo ==========================================================
echo    Starting OMEGA Stationery Web Storefront
echo    URL: http://localhost:3000
echo ==========================================================
cd /d "%~dp0"
set "PATH=C:\Users\Hp\AppData\Local\Programs\nodejs;%PATH%"
call npm run dev
pause

