// コマンドプロンプトを開く

var e = Editor;
var NOFILE = '(無題)';
var sh = new ActiveXObject("WScript.Shell");
var fso = new ActiveXObject("Scripting.FileSystemObject");

var DEFAULT_DIR = e.ExpandParameter("$S").replace(/[^\\]+$/,'');	//sh.SpecialFolders("Desktop");//Environment("SYSTEM").Item("USERPROFILE")

main();

function main(){
	var f = e.ExpandParameter("$F");
	var COMSPEC = sh.Environment("SYSTEM").Item("COMSPEC");
	
	if (f==NOFILE) {
		sh.CurrentDirectory = DEFAULT_DIR;
	} else {
		sh.CurrentDirectory = new ActiveXObject("Scripting.FileSystemObject").GetParentFolderName(f);
	}
	
	var setting = e.ExpandParameter("$M").replace(/[^\\]+$/,'') + 'setpath.txt';
	if (fso.FileExists(setting)) {
		var text = readFile(setting);
		if (text) {
			text = (text+";").replace(/#.+/mg,"").replace(/[\r\n]+/g,";").replace(/;+/g,";");
			COMSPEC += " /k SET PATH="+text+"%PATH%";
		}
	}
	
	sh.Run(COMSPEC , 1, false);
}

// ファイル読み込み
function readFile(path) {
	var ForReading = 1;
	if (!fso.FileExists(path)) return null;
	var stream = fso.OpenTextFile(path, ForReading);
	if (stream.AtEndOfStream) return null;
	var text = stream.ReadAll();
	stream.Close();
	return text;
}

