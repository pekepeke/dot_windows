@ECHO OFF
set CWD=%PWD%


FOR /D %%t in (%HOME%\.vim\neobundle\*) DO (
	if exist %%t\.git (
		echo %%t
		cd %%t
		git pull
		if exist %%t\doc\* copy %%t\doc\* %HOME%\.vim\neobundle\.neobundle\doc
	)
)

cd "%CWD%"
