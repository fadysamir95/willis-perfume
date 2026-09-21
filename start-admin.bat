@echo off
title Willi's Perfume - Admin Dashboard
cd /d "%~dp0"
echo ============================================================
echo   Willi's Perfume - Admin Dashboard
echo   The browser will open the control panel automatically.
echo   KEEP THIS WINDOW OPEN while working with the dashboard.
echo   Close it when you are done.
echo ============================================================
echo.
start "" "http://localhost:8080/admin.html"
timeout /t 1 /nobreak >nul
node tools\serve.js
echo.
pause