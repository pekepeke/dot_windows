function Install-Cygwin {
    param ( $TempCygDir="$env:temp\cygInstall" )
    if(!(Test-Path -Path $TempCygDir -PathType Container)) {
        $null = New-Item -Type Directory -Path $TempCygDir -Force
    }
    $client = new-object System.Net.WebClient
    if ([IntPtr]::Size -eq 4){
        # 32bit
        $client.DownloadFile("http://cygwin.com/setup-x86.exe", "$TempCygDir\setup.exe" )
    } else {
        $client.DownloadFile("http://cygwin.com/setup-x86_64.exe", "$TempCygDir\setup.exe" )
    }
    Start-Process -wait -FilePath "$TempCygDir\setup.exe" -ArgumentList "-q -n -l $TempCygDir -s http://mirror.steadfast.net/cygwin/ -R c:\Cygwin"
    Start-Process -wait -FilePath "$TempCygDir\setup.exe" -ArgumentList "-q -n -l $TempCygDir -s http://mirror.steadfast.net/cygwin/ -R c:\Cygwin -P openssh"
    Start-Process -wait -FilePath "$TempCygDir\setup.exe" -ArgumentList "-q -n -l $TempCygDir -s http://mirror.steadfast.net/cygwin/ -R c:\Cygwin -P wget"
}
Install-Cygwin