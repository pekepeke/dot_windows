@ECHO OFF

cd "%~dp0"

if exist ..\usr\local\bin (
	cd ..\usr\local\bin
	:: http://www.ysnb.net/meadow/meadow-develop/2006/msg00014.html
	if not exist w3m.exe iewget http://www.daionet.gr.jp/~knok/software/misc/w3m.exe
	:: http://blog.kowalczyk.info/software/the-silver-searcher-for-windows.html
	if not exist ag.exe iewget https://kjkpub.s3.amazonaws.com/software/the_silver_searcher/0.15pre/ag.exe
	:: http://jaxbot.me/articles/ag_the_silver_searcher_for_windows_6_8_2013

	:: http://blog.kowalczyk.info/software/pigz-for-windows.html
	if not exist pigz.exe iewget https://kjkpub.s3.amazonaws.com/software/pigz/2.3/pigz.exe
	if not exist unpigz.exe iewget https://kjkpub.s3.amazonaws.com/software/pigz/2.3/unpigz.exe
	if not exist es.exe iewget http://www.voidtools.com/es.exe
) else (
	echo dir not found.
	pause
)
