@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "C:\Users\sathw\.gemini\antigravity-ide\scratch\medibox-care"
call "C:\Program Files\nodejs\node.exe" ./node_modules/typescript/bin/tsc --noEmit
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%
call "C:\Program Files\nodejs\node.exe" ./node_modules/vite/bin/vite.js build
