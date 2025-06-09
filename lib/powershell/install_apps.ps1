. (Join-Path $PSScriptRoot "archive.ps1")


if (-not (Test-Path (Join-Path $HOME "Apps"))) {
    New-Item -ItemType Directory -Path (Join-Path $HOME "Apps")
}

$appsPath = Get-Item (Join-Path $HOME "Apps")
foreach ($app in @(
        [DownloadApp]::new("https://eithermouse.com/EitherMouse.zip", "EitherMouse", $appsPath)
        , [DownloadApp]::new("https://download.sysinternals.com/files/Ctrl2Cap.zip", "Ctrl2Cap", "helper")
        , [DownloadApp]::new("https://github.com/sakura-editor/sakura/releases/download/v2.4.2/sakura-tag-v2.4.2-build4203-a3e63915b-Win32-Release-Exe.zip", "Sakura", $appsPath)
        , [DownloadApp]::new("https://www.angusj.com/resourcehacker/resource_hacker.zip", "ResourceHacker", $appsPath)
        , [DownloadApp]::new("https://ftp.vector.co.jp/60/45/1855/MassiGra045.zip", "MassiGra", $appsPath)
        , [DownloadApp]::new("https://ftp.vector.co.jp/62/93/2327/er316.zip", "ERename", $appsPath)
        # , [DownloadApp]::new("https://github.com/masakazu-yanai/new-ex/releases/download/v3.0.0/new_ex_3.0.0.zip", "NewEX", $appsPath)
        , [DownloadApp]::new("https://www.knystudio.net/rapture-2.4.1.zip", "Rapture", $appsPath)
        , [DownloadApp]::new("https://crystalidea.com/downloads/speedyfox.zip", "SpeedyFox", $appsPath)
        , [DownloadTarApp]::new("https://ftp.vector.co.jp/10/71/2144/stir131.lzh", "Stirling", $appsPath, ".lzh")
        , [DownloadTarApp]::new("https://ftp.vector.co.jp/43/79/3276/df141.lzh", "Df", $appsPath, ".lzh")
        # , [DownloadApp]::new("", "", $appsPath)
        # , [DownloadTarApp]::new("", "", $appsPath)
        # , [DownloadTarApp]::new("", "", $appsPath, ".lzh")
        # , [DownloadTarApp]::new("https://github.com/mifi/lossless-cut/releases/download/v3.64.0/LosslessCut-win-x64.7z", "LosslessCut", $appsPath, ".7z")
    )) {
    if (-not (Test-Path $app.DestinationPath)) {
        $app.download()
        $app.extract()
        Write-Host("# installed app :" + $app.DestinationPath)
    } else {
        Write-Host("# skip - already installed : " + $app.DestinationPath)
    }
}

