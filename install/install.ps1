
# start-process "winget" -verb runas "settings --enable LocalManifestFiles"
# winget settings --enable LocalManifestFiles
$cwd = Get-Location
Set-Location (Get-Item -Path $PSCommandPath).Directory

Get-Content -Path winget-ids.txt | Where-Object {$_.trim()} | Where-Object { $_ -NotMatch "\s#*" } | ForEach { & winget install $_}

Set-Location $cwd