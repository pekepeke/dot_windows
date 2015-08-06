@if(0)==(0) ECHO OFF
CScript.exe //NoLogo //E:JScript "%~f0" %*
GOTO :EOF
@end

// ファイルをゴミ箱に送る。
// シェル名前空間でゴミ箱を指定してMoveHereする
var sh = WScript.CreateObject("Shell.Application");
var ssfBITBUCKET = 10;
var trash = sh.NameSpace(ssfBITBUCKET);
var fso = WScript.CreateObject("Scripting.FileSystemObject");

var filePath, filePaths = [];
for (var i=0, len = WScript.Arguments.Count(); i<len ; i++) {
  filePath = WScript.Arguments(i);
  if (fso.FileExists(filePath)) {
    trash.MoveHere(filePath);
    filePaths.push(filePath);
    WScript.Echo('moving "' + filePath + '" to the trash...');
  } else {
    WScript.Echo("cannot delete file:"+filePath);
  }
}
// 削除完了まで待つ（MoveHereは非同期なので）
while ( !isCompleteTransfer( filePaths ) ){
	WScript.Sleep(100);
}
WScript.Echo("complete");

function filter(arr, fn) {
  var ret = [];
  for (var i=0, l = arr.length; i<l ; i++) {
    fn(arr[i]) && ret.push(arr[i]);
  }
  return ret;
}

function isCompleteTransfer(filePaths) {
  return filter(filePaths, function(f) {
    return fso.FileExists(f);
  }).length <= 0;
}
