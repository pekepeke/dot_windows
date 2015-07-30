@echo OFF
set ROOT=%USERPROFILE%\デスクトップ
if not exist %ROOT% set ROOT=%USERPROFILE%\Desktop
set DD=%DATE:/=%
set DD=%DD:~2,6%
set NAME=%*
if "%NAME%"=="" set NAME=xxx
set _FOLDER="%ROOT%\%DD%_%NAME%"
set FOLDER="%_FOLDER%"
set NUM=0
set DEBUG=

:CHECK
if exist "%FOLDER%" (
	set /A NUM=%NUM%+1
	set FOLDER="%_FOLDER%_%NUM%"
	goto CHECK
)

%DEBUG% mkdir "%FOLDER%"
%DEBUG% type nul> "%FOLDER%\01_request.md"
%DEBUG% type nul> "%FOLDER%\02_memo.md"

