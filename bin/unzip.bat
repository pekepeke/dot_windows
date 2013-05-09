@if(0)==(0) ECHO OFF
CScript.exe //NoLogo //E:JScript "%~f0" %*
GOTO :EOF
@end
var sa = new ActiveXObject("Shell.Application");
var sh = new ActiveXObject("WScript.Shell");
var em, src, path;

for (em = new Enumerator(WScript.Arguments) ; !em.atEnd() ; em.moveNext()) {
	path = em.item() + "";
	if (path.indexOf(":") === -1) {
		path = sh.currentDirectory + "\\" + path;
	}
	src = sa.NameSpace(path);
	
	src.parentFolder.copyHere(src.items());
}
