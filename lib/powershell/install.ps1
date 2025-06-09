# [CmdletBinding()]
# param (
#     # Parameter help description
#     [Parameter(Mandatory = $false)] [switch] $IsHelp
# )

. (Join-Path $PSScriptRoot "archive.ps1")

$Packages = Get-Content -Path (Join-Path $PSScriptRoot "packages.json") -Raw | ConvertFrom-Json -AsHashtable

$Packages.Keys | ForEach-Object {
    $pkg = $Packages[$_]
    if ($pkg["name"] -eq $null) {
        $pkg["name"] = $_
    }
    if ($pkg["ext"] -eq $null) {
        $pkg["ext"] = "." + ($pkg["url"] -split '\.' | Select-Object -Last 1)
    }
    if ($pkg["type"] -eq $null) {
        switch ($pkg["ext"]) {
            ".zip" {
                $pkg["type"] = "zip"
            }
            ".tar.gz" {
                $pkg["type"] = "tar"
            }
            ".lzh" {
                $pkg["type"] = "tar"
            }
            ".7z" {
                $pkg["type"] = "tar"
            }
            Default {}
        }
    }
}

$TargetPackages = @() + ($args | Where-Object { $_ -notmatch "^\s*$" })

if ($IsHelp -or $TargetPackages.Length -le 0) {
    Write-Host "Usage: install.ps1 <PackageName>"
    Write-Host "Example: install.ps1 'git'"
    return
}

$appsPath = Get-Item (Join-Path $HOME "Apps")
foreach ($package in $TargetPackages) {
    if ($Packages.containsKey($package)) {
        $pkg = $Packages[$package]
        if ($pkg["type"] -eq "tar") {
            $app = [DownloadTarApp]::new($pkg["url"], $pkg["name"], $appsPath, $pkg["ext"])
        } elseif ($pkg["type"] -eq "zip") {
            $app = [DownloadApp]::new($pkg["url"], $pkg["name"], $appsPath)
        } else {
            Write-Host("Unknown package type: " + $pkg["type"])
            continue
        }
        if ($null -ne $pkg["after"]) {
            $app.AfterCallBack = [scriptblock]::Create($pkg["after"])
        }
        if (-not (Test-Path $app.DestinationPath)) {
            $app.download()
            $app.extract()
            Write-Host("# installed app :" + $app.DestinationPath)
        } else {
            Write-Host("# skip - already installed : " + $app.DestinationPath)
        }
    } else {
        Write-Host("Package not found: " + $package)
    }
}