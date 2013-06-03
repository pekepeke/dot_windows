@ECHO OFF

cd "%~dp0"

if exist ..\usr\local\bin (
	cd ..\usr\local\bin
	:: http://www.ysnb.net/meadow/meadow-develop/2006/msg00014.html
	wget http://www.daionet.gr.jp/~knok/software/misc/w3m.exe
) else (
	echo dir not found.
	pause
)
