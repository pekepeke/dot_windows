@echo OFF
cd %HOME%
zip -r dotpack.zip .vim .screenrc .vimrc .zshenv .zshrc .shrc.* .bashrc .bash_profile bin
