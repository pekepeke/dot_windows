# Get-Content -Path apps.txt | Where-Object {$_.trim()} | Where-Object { $_ -NotMatch "\s#*" } | ForEach { & "cmd.exe" "/C" "echo" $_}
Get-Content -Path apps.txt | Where-Object {$_.trim()} | Where-Object { $_ -NotMatch "\s#*" } | ForEach { & "cmd.exe" "/C" "cinst" $_}

