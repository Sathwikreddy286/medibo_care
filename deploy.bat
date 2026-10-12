@echo off
set "PATH=C:\Users\sathw\mingit\cmd;C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
call npm.cmd run deploy
