@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "C:\Users\sathw\.gemini\antigravity-ide\scratch\medibox-care"
call "C:\Program Files\nodejs\node.exe" ./node_modules/vite/bin/vite.js --host 127.0.0.1 --port 3000
