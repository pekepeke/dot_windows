@ECHO OFF
set CWD=%PWD%

FOR /D %%t in (%HOME%\.vim\neobundle\*) DO (
	echo %%t
	cd %%t
	git status -s
)

cd "%CWD%"
