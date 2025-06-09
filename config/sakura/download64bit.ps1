Set-Location (Get-Item -Path $PSCommandPath).Directory

$urlList = @(
    "https://ht-deko.com/software/ppa_124.lzh"
    , "https://www.w32tex.org/w32/patch-diff-w32.zip"
    , "https://github.com/universal-ctags/ctags-win32/releases/download/v6.1.0/ctags-v6.1.0-x64.zip"
    , "https://files.kaoriya.net/goto/cmigemo_w64"
)

foreach ($url in $urlList) {
    $name = $url.Split("/")[-1]
    $ext = $name.Split(".")[-1]
    if ($name -eq $ext) {
        $name = $name + ".zip"
        $ext = "zip"
    }
    if (-not (Test-Path "archive")) {
        New-Item -ItemType Directory "archive"
    }
    $fpath = (Join-Path "archive" $name)
    Invoke-WebRequest -Uri $url -OutFile $fpath
    if ($ext -eq "zip") {
        Expand-Archive -Path $fpath -DestinationPath "archive"
    } else {
        $options = (" /c {0} -xf {1} -C {2}" -f (Join-Path $env:SystemRoot "System32\tar.exe"), $fpath, "archive")
        Write-Host($options)
        & "cmd.exe" $options
    }
}
