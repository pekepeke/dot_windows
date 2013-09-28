@echo OFF
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
	"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" %*
) else (
	"%APPDATA%\Google\Chrome\Application\chrome.exe" %*
)
