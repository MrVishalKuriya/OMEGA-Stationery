@echo off
TITLE OMEGA Stationery - Java Spring Boot Backend
echo ==========================================================
echo    Launching OMEGA Stationery Java Spring Boot Backend
echo    Port: 8080 ^| Java 21 ^| Spring Data MongoDB
echo ==========================================================
cd /d "%~dp0backend-java"
IF EXIST "C:\Users\Admin\Desktop\OPELS EDU\apache-maven-3.9.9\bin\mvn.cmd" (
    "C:\Users\Admin\Desktop\OPELS EDU\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
) ELSE (
    mvn spring-boot:run
)
pause
