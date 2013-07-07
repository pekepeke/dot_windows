@ECHO OFF
set CWD=%PWD%

FOR /D %%t in (%HOME%\.vim\neobundle\*) DO (
	echo %%t
	cd %%t
	git gc
)

cd "%CWD%"
pause