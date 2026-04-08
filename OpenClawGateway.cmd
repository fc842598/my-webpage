@echo off
setlocal
set "PATH=C:\Program Files\nodejs;%PATH%"
start "" /min cmd /c "\"%APPDATA%\npm\openclaw.cmd\" gateway run --compact"
