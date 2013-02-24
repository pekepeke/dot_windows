@echo OFF

if not defined HOME (
	echo env ^%HOME^%: not found
	goto EOF
)
if not exist %HOME%\.windows (
	git clone git://github.com/pekepeke/dot_windows.git %HOME%\.windows
)

goto :EOF
