
function ..() {
  cd ../
}
function wsl-ubuntu() {
  wsl -d Ubuntu24.04
}
function sudo() {
  $s = [string]::Join(" ", $args)
  Start-Process -Verb runas powershell "${s} ; pause"
}

# function notepad() {
#   $notepad = $env:SystemRoot + "\System32\notepad.exe"
#   # Start-Process $notepad @args
#   if ($args.Count -gt 0) {
#     foreach ($f in $args) {
#       Start-Process $notepad $f
#     }
#   }
#   else {
#     Invoke-Item $notepad
#   }
# }

function Remove-Item-ToRecycleBin() {
  $shell = New-Object -ComObject Shell.Application
  Get-Item $args | ForEach-Object {
    $target = $_
    $targetDir = Split-Path $target -Parent
    $targetFilename = Split-Path $target -Leaf
    $shell.Namespace($targetDir).ParseName($targetFilename).InvokeVerb("delete")
  }
}
$AliasMappings = @{
  "notepad" = $env:SystemRoot + "\System32\notepad.exe";
  "ise" = $env:SystemRoot + "\System32\WindowsPowerShell\v1.0\Powershell_ise.exe";
  "gvim" = $env:ProgramFiles + "\Vim\vim91\gvim.exe";
  "git-bash" = $env:ProgramFiles + "\Git\bin\bash.exe";
  "nvim" = $env:ProgramFiles + "\Neovim\bin\nvim.exe"
}
foreach ($cmd in $AliasMappings.Keys) {
  if (Test-Path $AliasMappings[$cmd]) {
    Set-Alias $cmd $AliasMappings[$cmd]
  }
}
Set-Alias touch New-Item
Set-Alias xclip Set-Clipboard
Set-Alias pbcopy Set-Clipboard
Set-Alias which Get-Command
Set-Alias open explorer
Set-Alias rmtrash Remove-Item-ToRecycleBin -Option AllScope

# https://learn.microsoft.com/en-us/powershell/module/psreadline/set-psreadlineoption?view=powershell-7.5&viewFallbackFrom=powershell-6
Set-PSReadLineOption -EditMode Emacs -BellStyle None

Import-Module posh-git
if (($PSVersionTable.PSVersion.Major -ge 6) -and ($null -ne (Get-Command mise -ErrorAction Ignore))) {
  # mise activate pwsh | Out-String | Invoke-Expression
  $misePsFilePath = Join-Path (Split-Path $PROFILE.CurrentUserAllHosts -Parent) "mise.ps1"
  if (-not (Test-Path $misePsFilePath)) {
    mise activate pwsh | Out-String > $misePsFilePath
  }
  . $misePsFilePath
}