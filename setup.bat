@echo OFF

if not exist %ChocolateyInstall% (
	@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('http://chocolatey.org/install.ps1'))"
	cinst "git"
)
if not defined HOME (
	echo env ^%HOME^%: not found
	goto EOF
)
if not exist %HOME%\.windows (
	git clone --depth=1 git://github.com/pekepeke/dot_windows.git %HOME%\.windows
	cd "%HOME%\.windows"
	git submodule update --init
) else (
	git pull --rebase
	git submodule update --init
)

goto EOF

:EOF
pause