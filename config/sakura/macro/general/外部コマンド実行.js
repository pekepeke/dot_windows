// 任意の拡張子で外部コマンド実行
//var SETTING_FILE = Editor.ExpandParameter("$M").replace(/[^\.]+$/g,'txt');
var e = Editor;
var SETTING_FILE = e.ExpandParameter("$M").replace(/[^\\]+$/g,'excommand.txt');
var CONSTANTS_FILE = e.ExpandParameter("$M").replace(/[^\\]+$/g,'command_constants.txt');

var NOFILE = '(無題)';
var fso = new ActiveXObject("Scripting.FileSystemObject");
var sh = new ActiveXObject("WScript.Shell");
function CmdInfo(){
	this.name;
	this.cmd;
}

main();

function main(){
	var path = e.ExpandParameter("$F");
	//if (path == NOFILE) return;
	
	var ext = path.match(/[^\.]+$/);
	var info = getCommands(ext);
	if (!info){
		return;
	}
	
	var popup = new ActiveXObject("EditorHelper.PopUp");
	for (var i=0; i<info.length; i++){
//		popup.AddMenu(info[i].name +"(&"+(i+1<10?i+1:String.fromCharCode((i-9)%26+0x41))+")", i+1);
		popup.AddMenu(info[i].name +"(&"+(String.fromCharCode(i%26+0x41))+")", i+1);
	}
	var idx = popup.TrackMenu() - 1;
	
	if (idx < 0) return;
	var cmd = info[idx].cmd;
	
	cmd = parseCommand(path, cmd);
	execCommandList(cmd);
}

// ファイル読み込み
function readFile(path) {
	var ForReading = 1;
	var text = '';
	if (!fso.FileExists(path)) return null;
	var stream = fso.OpenTextFile(path, ForReading);
	if (!stream.AtEndOfStream) text = stream.ReadAll();
	stream.Close();
	return text;
}

function getCommands(ext){
	ext = (ext+"").toLowerCase();
	var text = readFile(SETTING_FILE);
	if (!text) return null;
	text = text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/^#.*\n/gm,'');
	var line = text.split("\n");
	var info = new Array();
	for (var i=0;i<line.length;i++){
		var item = line[i].replace(/\t+/g,'\t').replace(/\t$/,'').split("\t");
		if (item.length <= 2) continue;
		
		var tmp = new CmdInfo();
		
		tmp.name = item[0];
		item.shift();
		
		// 拡張子探し
		var l = item[0].toLowerCase().split(",");
		var found = false;
		for (var j=0; j<l.length; j++) if (l[j] == ext || l[j]=="*" ) { found = true; break; }
		if (!found) continue;
		item.shift();
		
		tmp.cmd = item;
		
		info.push(tmp);
	}
	return info;
}

function parseCommand(path, list){
	var l = [
		['s',fso.GetParentFolderName(e.ExpandParameter("$S"))],
		['m',fso.GetParentFolderName(e.ExpandParameter("$M"))],
		['d',fso.GetParentFolderName(path)],				// dir
		['c',sh.Environment("SYSTEM").Item("COMSPEC")]	// cmd.exe
	];
	
	var defs = parseConstants();
	if (defs) l=l.concat(defs);
	for (var i=0;i<list.length;i++){
		var text = list[i].replace(/%%/g,"\t");
		for (var j=0;j<l.length;j++){
            if (l[j][0]) text = text.replace(new RegExp('%'+l[j][0],"g"), l[j][1]);
		}
		list[i] = text.replace(/\t/g,"%");
	}
	return list;
}

function parseConstants(){
    var ret = new Array();
    var text = readFile(CONSTANTS_FILE);
    if (!text) return ret;
    text = text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/^#.*\n/gm,'');
    var l = text.split("\n");
    for (var i=0; i<l.length; i++){
        var items = l[i].split("\t");
        if (items.length >= 1) ret.push(new Array(items[0],items[1]));
    }
    return ret;
}

function execCommandList(list){
	var stdout = 0;
	for (var i=0;i<list.length;i++){
		if (!list[i]) continue;
		
		if (i==0 && !isNaN(list[i]) ) {
			stdout = list[i];
			continue;
		}
		try {
			if (list[i].charAt(0) == "?") {
				var c = prompt("実行するコマンドを入力して下さい。","実行するコマンドを入力",
								e.ExpandParameter(list[i].substring(1,list[i].length)) );
				if (!c) continue;
				list[i] = c;
			}
			if (stdout == 0) sh.Run(e.ExpandParameter(list[i]), 1, false);
			else e.ExecCommand( sh.ExpandEnvironmentStrings(list[i]), stdout);
		} catch (err) {
			e.TraceOut('original:'+list[i]);
			e.TraceOut('expand  :'+e.ExpandParameter(list[i]));
			e.TraceOut('desc    :'+err.number + "-" + err.description);
		}
	}
}

function prompt(msg, title, def){
	if (typeof(_g_control) == 'undefined') {
		_g_control = new ActiveXObject("ScriptControl");
		_g_control.Language = "VBScript";
	}
	var src = 'InputBox("' + _vbescape(msg) + '", ' +
		'"' + _vbescape( title || '') + '", ' +
		'"' + _vbescape( def || '') + '")';
	_g_control.AddCode("Function Hoge() : Hoge = " + src + " : End Function");
	return _g_control.Run("Hoge");
}

function _vbescape(v) {
	return ("" + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "'); // "
}
