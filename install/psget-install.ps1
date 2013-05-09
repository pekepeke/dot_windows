Set-ExecutionPolicy RemoteSigned
(new-object Net.WebClient).DownloadString("http://psget.net/GetPsGet.ps1") | iex
