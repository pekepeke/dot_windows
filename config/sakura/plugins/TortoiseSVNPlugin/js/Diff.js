// TortoiseSVNPlugin - 差分表示コマンド  2010/04/17
function main() {
	var shell = new ActiveXObject('WScript.Shell');
	var path = Plugin.GetOption('TortoiseSVN', 'Path');
	if (path == null || path == '') return;

	var cmd = path + "\\bin\\TortoiseProc.exe";
	cmd += " /command:diff";
	cmd += " /path:\"" + Editor.GetFilename() + "\"";
	shell.Exec(cmd);
}

main();
