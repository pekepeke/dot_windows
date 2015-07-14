@echo off

set CYGWIN=%USERPROFILE%\.babun\cygwin

set SH=%CYGWIN%\bin\bash.exe

"%SH%" -c "/usr/bin/%~n0 %*"
