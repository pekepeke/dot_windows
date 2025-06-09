class Archive {
    [string] $Uri
    [string] $Name
    [string] $DestinationPath
    [string] $AppBaseDir
    [string] $Extension
    [scriptblock] $AfterCallBack = $null
    Archive([string]$uri, [string]$name, [string]$appBaseDir) {
        $this.Init($uri, $name, $appBaseDir)
    }
    Archive([string]$uri, [string]$name, [string]$appBaseDir, [string] $ext) {
        $this.Init($uri, $name, $appBaseDir, $ext)
    }
    Archive([string]$uri, [string]$name, [string]$appBaseDir, [string] $ext, [scriptblock] $afterCallBack) {
        $this.Init($uri, $name, $appBaseDir, $ext, $afterCallBack)
    }
    hidden Init([string]$uri, [string]$name, [string]$appBaseDir) {
        $this.Uri = $uri
        $this.Name = $name
        $this.AppBaseDir = $appBaseDir
        $this.DestinationPath = Join-Path $appBaseDir $name
    }
    hidden Init([string]$uri, [string]$name, [string]$appBaseDir, [string] $ext) {
        $this.Init($uri, $name, $appBaseDir)
        $this.Extension = $ext
    }
    hidden Init([string]$uri, [string]$name, [string]$appBaseDir, [string] $ext, [scriptblock] $afterCallBack) {
        $this.Init($uri, $name, $appBaseDir, $afterCallBack)
        $this.Extension = $ext
    }
    [string] makeArchivePath([string] $ext) {
        return Join-Path (Get-Item $env:TEMP) ($this.name + $ext)
    }
    [string] GetArchivePath() {
        return $this.makeArchivePath($this.Extension)
    }
    [void] download() {
        Invoke-WebRequest -Uri $this.Uri -OutFile $this.GetArchivePath()
    }
    [void] extract() {
        Expand-Archive -Path $this.GetArchivePath() -DestinationPath $this.DestinationPath
        if ($null -ne $this.AfterCallBack) {
            Invoke-Command -ScriptBlock $this.AfterCallBack
        }
    }
}

class DownloadApp: Archive {
    [string] $Extension = ".zip"
    DownloadApp([string]$uri, [string]$name, [string]$appBaseDir) : base($uri, $name, $appBaseDir) {
    }
    DownloadApp([string]$uri, [string]$name, [string]$appBaseDir, [scriptblock] $afterCallBack) : base($uri, $name, $appBaseDir) {
        this.AfterCallBack = $afterCallBack
    }
}

class DownloadTarApp : Archive {
    [string] $Extension = ".tar.gz"
    DownloadTarApp([string]$uri, [string]$name, [string]$appBaseDir) : base($uri, $name, $appBaseDir) {
    }
    DownloadTarApp([string]$uri, [string]$name, [string]$appBaseDir, [string] $ext) : base($uri, $name, $appBaseDir, $ext) {
    }

    DownloadTarApp([string]$uri, [string]$name, [string]$appBaseDir, [string] $ext, [scriptblock] $afterCallBack) : base($uri, $name, $appBaseDir, $ext, $afterCallBack) {
    }
    [void] extract() {
        if (-not (Test-Path $this.DestinationPath)) {
            New-Item -ItemType Directory -Path $this.DestinationPath
        }
        # $options = (" /c {0} -xf `"{1}`" -C `"{2}`"" -f (Join-Path $env:SystemRoot "System32\tar.exe"), $this.GetArchivePath(), $this.DestinationPath)
        $options = (" /c {0} -xf {1} -C {2}" -f (Join-Path $env:SystemRoot "System32\tar.exe"), $this.GetArchivePath(), $this.DestinationPath)
        Write-Host("# execute: cmd " + $options)
        & "cmd.exe" $options
    }
}