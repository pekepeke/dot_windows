@echo OFF

if not defined HOME (
	echo env ^%HOME^%: not found
	goto EOF
)
if not exist %HOME%\.windows (
	git clone --depth=1 git://github.com/pekepeke/dot_windows.git %HOME%\.windows
	cd "%HOME%\.windows"
	git submodule update --init
)

goto EOF

:EOF
