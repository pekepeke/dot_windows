@ECHO OFF
cd %HOME%\.github-dotfiles
git submodule update --init
git submodule foreach "git checkout master; git fetch; git pull"
if exist "%HOME%\.windows" (
	cd "%HOME%\.windows"
	git pull
	git submodule update -init
)
@start "" gvim -c "silent NeoBundleInstall" -c "silent NeoBundleInstall!" -c "quitall"

