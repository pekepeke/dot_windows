@ECHO OFF

cd "%HOMEPATH%"

git clone git://github.com/hakobera/nvmw.git .nvmw
set PATH=%HOMEPATH%\.nvmw;%PATH%
