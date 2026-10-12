@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "C:\Users\sathw\.gemini\antigravity-ide\scratch\medibox-care"
call node node_modules/typescript/bin/tsc --noEmit
if %errorlevel% neq 0 (
    echo Typecheck FAILED with error level %errorlevel%
    exit /b %errorlevel%
)
call node node_modules/vite/bin/vite.js build
if %errorlevel% neq 0 (
    echo Vite build FAILED with error level %errorlevel%
    exit /b %errorlevel%
)
echo BUILD SUCCESSFUL
