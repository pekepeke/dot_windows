@ECHO OFF
cd "%~dp0..\lib"
set ChocolateyInstall=%CD%\chocolatey
CScript "%~dp0set_env.js" /A ChocolateyInstall %ChocolateyInstall%

mkdir %ChocolateyInstall%
@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('http://chocolatey.org/install.ps1'))"
