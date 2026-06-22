@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 학습도구 (구버전) 서버

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8888" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

echo.
echo  학습도구 구버전 실행 중...
echo  http://127.0.0.1:8888/
echo  종료: Ctrl+C
echo.

start "" "http://127.0.0.1:8888/"
python -m http.server 8888 --bind 127.0.0.1
pause
