# OMEGA Stationery - Java Spring Boot Backend Launch Script
$ErrorActionPreference = 'Stop'
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting OMEGA Stationery Java Spring Boot Backend     " -ForegroundColor Yellow
Write-Host "   Port: 8080 | Java 21 | Spring Data MongoDB             " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$mavenCmd = "C:\Users\Admin\Desktop\OPELS EDU\apache-maven-3.9.9\bin\mvn.cmd"
if (-not (Test-Path $mavenCmd)) {
    $mavenCmd = "mvn"
}

$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendDir

Write-Host "Executing Spring Boot application from $backendDir..." -ForegroundColor Green
& $mavenCmd spring-boot:run
