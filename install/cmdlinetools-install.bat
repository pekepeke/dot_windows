@ECHO OFF

cd "%~dp0"
if not exist ..\usr\local\bin (
	echo dir not found.
	pause
	goto END
)

cd ..\usr\local\bin
set BINDIR=%CD%
:: http://www.ysnb.net/meadow/meadow-develop/2006/msg00014.html
if not exist w3m.exe (
	call iewget "http://www.daionet.gr.jp/~knok/software/misc/w3m.exe"
)
:: http://blog.kowalczyk.info/software/the-silver-searcher-for-windows.html
:: if not exist ag.exe (
:: 	iewget https://kjkpub.s3.amazonaws.com/software/the_silver_searcher/0.15pre/ag.exe
:: )
:: http://jaxbot.me/articles/ag_the_silver_searcher_for_windows_6_8_2013

:: http://blog.kowalczyk.info/software/pigz-for-windows.html
if not exist pigz.exe (
	call iewget "https://kjkpub.s3.amazonaws.com/software/pigz/2.3/pigz.exe"
)
if not exist unpigz.exe (
	call iewget "https://kjkpub.s3.amazonaws.com/software/pigz/2.3/unpigz.exe"
)
if not exist es.exe (
	call iewget "http://www.voidtools.com/es.exe"
)
::if not exist jvgrep.exe (
::	iewget "https://github.com/mattn/jvgrep/releases/download/v3.5/jvgrep-win32-3.5.tar.gz"
::)

if not exist %BINDIR%\curl.exe (
	mkdir cmdinst
	cd cmdinst
	call iewget "http://www.paehl.com/open_source/?download=curl_732_0_ssl.zip" curl.zip
	call winunzip curl.zip
	move curl.exe %BINDIR%\
	cd ..
	rmdir /S /Q cmdinst
)

if not exist %BINDIR%\wget.exe (
	mkdir cmdinst
	cd cmdinst
	curl -Lo wget.zip "http://downloads.sourceforge.net/project/gnuwin32/wget/1.11.4-1/wget-1.11.4-1-bin.zip?r=http%3A%2F%2Fgnuwin32.sourceforge.net%2Fpackages%2Fwget.htm&ts=1382759741&use_mirror=jaist"
	call winunzip wget.zip
	move bin\wget.exe %BINDIR%\
	cd ..
	rmdir /S /Q cmdinst
)
if not exist %BINDIR%\tar.exe (
	mkdir cmdinst
	cd cmdinst
	curl -Lo tar.zip "http://downloads.sourceforge.net/project/gnuwin32/tar/1.13-1/tar-1.13-1-bin.zip?r=http%3A%2F%2Fsourceforge.net%2Fprojects%2Fgnuwin32%2Ffiles%2Ftar%2F1.13-1%2F&ts=1382760153&use_mirror=jaist"
	call winunzip tar.zip
	move bin\tar.exe %BINDIR%\
	cd ..
	rmdir /S /Q cmdinst
)
if not exist %BINDIR%\unzip.exe (
	mkdir cmdinst
	cd cmdinst
	curl -Lo unzip.zip "http://downloads.sourceforge.net/project/gnuwin32/unzip/5.51-1/unzip-5.51-1-bin.zip?r=http%3A%2F%2Fsourceforge.net%2Fprojects%2Fgnuwin32%2Ffiles%2Funzip%2F5.51-1%2F&ts=1382760180&use_mirror=jaist"
	call winunzip unzip.zip
	move bin\unzip.exe %BINDIR%\
	cd ..
	rmdir /S /Q cmdinst
)

:END
