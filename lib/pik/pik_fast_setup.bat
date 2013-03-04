@echo OFF

PATH=%~dp0;%~dp0\ruby\bin;%PATH%

if not exist "%USERPROFILE%\.pik" mkdir "%USERPROFILE%\.pik"

set TARGET=%USERPROFILE%\.pik\config.yml

if not exist "%TARGET%" (
	echo --- >> "%TARGET%"
	echo --- >> "%TARGET%"
	echo :install_dir: !ruby/object:Pathname >> "%TARGET%"
	echo   path: %USERPROFILE%\.pik\versions >> "%TARGET%"
)

set TARGET=%USERPROFILE%\.pik\.pikrc

if not exist "%TARGET%" (
	echo #!/bin/sh>>"%TARGET%"
	echo pik_path=$HOME/.pik>>"%TARGET%"

	echo function pik  {>>"%TARGET%"
	echo   $pik_path/pik_runner.exe pik.sh $@>>"%TARGET%"
	echo   [[ -s $USERPROFILE/.pik/pik.sh ]] ^&^& source $USERPROFILE/.pik/pik.sh>>"%TARGET%"
	echo } >>"%TARGET%"
)


pik install devkit
