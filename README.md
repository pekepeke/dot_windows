dot_windows
===========

## mingw + mintty

```bash
mingw-get install mintty
mingw-get install openssl openssh
```

### Create shortcut mintty.exe

```
C:\MinGW\msys\1.0\msys.bat --mintty
C:\MinGW\msys\1.0\bin\mintty.exe /bin/bash --login -i
```

## Cygwin

### Install apt-cyg
```bash
wget http://apt-cyg.googlecode.com/svn/trunk/apt-cyg
mv apt-cyg  /usr/bin
chmod +x /usr/bin/apt-cyg
```
