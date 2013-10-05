@ECHO OFF
set CWD=%PWD%

FOR /D %%t in (%HOME%\.vim\neobundle\*) DO (
	cd %%t
	if EXIST %%t\.git (
		echo %%t
		git %*
		if errorlevel 1 exit
	) else {
		echo skip %%t
	)
)

cd "%CWD%"
