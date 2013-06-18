@ECHO OFF

cd "%~dp0"
move sakura.ini _sakura.ini
CScript.exe zz_mru_remove.js

if not exist sakura.ini pause