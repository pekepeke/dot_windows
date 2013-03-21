@ECHO OFF


copy "%APPDATA%\InstallPad\InstallPad.exe.config" "%APPDATA%\InstallPad\InstallPad.exe.config.org" >nul

echo ^<^?xml version="1.0" encoding="utf-8" ^?^> > "%APPDATA%\InstallPad\InstallPad.exe.config"
echo ^<configuration^> >>"%APPDATA%\InstallPad\InstallPad.exe.config"
echo   ^<appSettings^> >>"%APPDATA%\InstallPad\InstallPad.exe.config"
echo       ^<add key="AppListFile" value="" /^> >>"%APPDATA%\InstallPad\InstallPad.exe.config"
echo       ^<add key="DownloadTo" value="%TEMP%\InstallPad\" /^> >>"%APPDATA%\InstallPad\InstallPad.exe.config"
echo       ^<add key="InstallationRoot" value="%HOME%\Apps" /^> >>"%APPDATA%\InstallPad\InstallPad.exe.config"
echo       ^<add key="AlternateDownloadLocation" value="" /^> >>"%APPDATA%\InstallPad\InstallPad.exe.config"
echo   ^</appSettings^> >>"%APPDATA%\InstallPad\InstallPad.exe.config"
echo ^</configuration^> >>"%APPDATA%\InstallPad\InstallPad.exe.config"

echo このウィンドウは閉じないでください
start /wait InstallPad.exe

copy "%APPDATA%\InstallPad\InstallPad.exe.config.org" "%APPDATA%\InstallPad\InstallPad.exe.config" >nul
if not exist "%APPDATA%\InstallPad\InstallPad.exe.config.org" del "%APPDATA%\InstallPad\InstallPad.exe.config"
