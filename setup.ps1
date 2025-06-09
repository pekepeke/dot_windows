Param (
	[switch] $Uninstall
)

$repoDir = (Join-Path $HOME ".windows")
$appendPaths = @(
	"bin"
	, "usr\bin"
	, "usr\local\bin"
	# , "usr\dll"
	# , "usr\local\dll"
)
$UserShellFolders = $(Get-ItemProperty 'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders')
$startupFiles = @(
	"config\ahk2\ahk.ahk"
)
$linkFiles = @{
	# "config\WindowsPowerShell\profile.ps1" = $PROFILE.CurrentUserAllHosts;
}
$installScripts = @(
	"lib\powershell\install_apps.ps1"
)
$profileFiles = @(
	"config\WindowsPowerShell\profile.ps1"
)
$powershellModules = @(
	"posh-git"
)
$downloadFiles = @{
	".local\share\words" = "https://raw.githubusercontent.com/eneko/data-repository/master/data/words.txt";
}

Function Test-ModuleInstalled {
    param (
        [System.String]$ModuleName
    )

    $isInstalled = $false

    # モジュール情報を取得
    $module = (Get-Module -ListAvailable -Name $ModuleName)
    # モジュールが導入済みの場合
    if ($null -ne $module) {
        $isInstalled = $true
    }

    return $isInstalled
}

function ExecInstall {
	if (-not (Test-Path -Path $repoDir)) {
		git clone --depth=1 git://github.com/pekepeke/dot_windows.git $repoDir
		Set-Location $repoDir
		git submodule update --init
	} else {
		git pull --rebase
		# git submodule update --init
	}

	$envPath = [Environment]::GetEnvironmentVariable("Path", "User")
	$currentPaths = $envPath.Split(";")
	$isUpdatedEnv = $false
	foreach ($dir in $appendPaths) {
		$bin = Join-Path $repoDir $dir
		if ($currentPaths -contains $bin) {
			Write-Host("already appended: " + $bin)
			continue
		}
		$envPath += ";$bin"
		$isUpdatedEnv = $true
	}
	if ($isUpdatedEnv) {
		Write-Host("# update PATH=" + $envPath.Replace(";;", ";"))
		[Environment]::SetEnvironmentVariable("Path", $envPath.Replace(";;", ";"), "User")
	}

	$startupFolder = $UserShellFolders.Startup
	$wshShell = New-Object -ComObject WScript.Shell
	foreach ($f in $startupFiles) {
		$fpath = Get-Item $f
		$linkTo = Join-Path $startupFolder ((Get-Item $fpath).Name + ".lnk")
		if (-not (Test-Path $linkTo)) {
			Write-Host("# create shortcut: " + $fpath + "->" + $linkTo)
			$shortcut = $wshShell.CreateShortcut($linkTo)
			$shortcut.TargetPath = $fpath
			# $shortcut.Arguments = "--mode=debug"
			$shortcut.Save()
			# New-Item -ItemType SymbolicLink -Target $fpath -Path $linkTo
		}
	}
	foreach ($srcPath in $linkFiles.Keys) {
		if (-not (Test-Path $linkFiles[$srcPath])) {
			$dirPath = Split-Path $linkFiles[$srcPath] -Parent
			if (-not (Test-Path $dirPath)) {
				Write-Host("# create directory: " + $dirPath)
				New-Item -ItemType Directory -Path $dirPath -Force
			}
			Write-Host("# create symlink: " + $srcPath + "->" + $linkFiles[$srcPath])
			New-Item -ItemType SymbolicLink -Target $srcPath -Path $linkFiles[$srcPath]
		}
	}
	foreach ($filename in $downloadFiles.Keys) {
		$path = Join-Path $HOME $filename
		$dirPath = Split-Path $path -Parent
		if (-not (Test-Path $dirPath)) {
			mkdir $dirPath
		}
		if (-not (Test-Path $path)) {
			Invoke-WebRequest -Uri $downloadFiles[$filename] -OutFile $path
		}
	}
	foreach ($s in $installScripts) {
		. $s
	}

	# "config\WindowsPowerShell\profile.ps1" = $PROFILE.CurrentUserAllHosts
	if (-not (Test-Path $PROFILE.CurrentUserAllHosts)) {
		$filesStr = $profileFiles | ForEach-Object { '"' + (Get-Item $_).FullName + '"'}
		Write-Host("# created: " + $PROFILE.CurrentUserAllHosts)
		Set-Content $PROFILE.CurrentUserAllHosts @"
`$script = `@($filesStr)
foreach (`$s in `$script) {
  if (Test-Path `$s) {
    . `$s
  }
}
"@
	}

	foreach ($module in $powershellModules) {
		if (-not (Test-ModuleInstalled $module)) {
			Install-Module $module -Scope CurrentUser -Force
		}
	}
	Write-Host(@"
Start-Process -Verb Runas .\helper\Ctrl2Cap\Ctrl2Cap.exe /install
wsl --update
wsl --install -d Ubuntu-24.04

wsl -d Ubuntu-24.04 -e bash
# uncomment install_ubuntu_font
# vi /usr/lib/wsl/wsl-setup:111
"@)
}
function ExecUninstall {
	$startupFolder = $UserShellFolders.Startup
	foreach ($fpath in $startupFiles) {
		$linkTo = Join-Path $startupFolder ((Get-Item $fpath).Name + ".lnk")
		if (Test-Path $linkTo) {
			Write-Host("# remove: " + $linkTo)
			Remove-Item -Path $linkTo
		}
	}
	foreach ($srcPath in $linkFiles.Keys) {
		if (Test-Path $linkFiles[$srcPath]) {
			Write-Host("# remove: " + $linkFiles[$srcPath])
			Remove-Item -Path $linkFiles[$srcPath]
		}
	}
	# if (Test-Path $PROFILE.CurrentUserAllHosts) {
	# 	Remove-Item -Path $PROFILE.CurrentUserAllHosts
	# }

	foreach ($module in $powershellModules) {
		if (Test-ModuleInstalled $module) {
			Uninstall-Module $module -Scope CurrentUser -Force
		}
	}
	Write-Host(@"
Start-Process -Verb Runas .\helper\Ctrl2Cap\Ctrl2Cap.exe /uninstall
"@)
}

if ($Uninstall) {
	ExecUninstall
} else {
	ExecInstall
}
