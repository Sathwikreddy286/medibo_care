@echo off
title Push MediBox Care to GitHub
set "PATH=C:\Users\sathw\mingit\cmd;%PATH%"
cd /d "%~dp0"

echo ===================================================
echo     Pushing MediBox Care to your GitHub Repository
echo ===================================================
echo.
echo If a browser or GitHub login window opens,
echo please click 'Sign in' or 'Authorize'.
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo  SUCCESS! Your code has been uploaded to GitHub!
    echo ===================================================
) else (
    echo ===================================================
    echo  Push was not completed. Check errors above.
    echo ===================================================
)
echo.
pause
