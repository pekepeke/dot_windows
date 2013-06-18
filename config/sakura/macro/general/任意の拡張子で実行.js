// 任意の拡張子で関連付け実行
(function(){	//}}
//var SETTING_FILE = Editor.ExpandParameter("$M").replace(/[^\.]+$/g,'txt');
var SETTING_FILE = Editor.ExpandParameter("$M").replace(/[^\\]+$/g,'command.txt');
var CONSTANTS_FILE = Editor.ExpandParameter("$M").replace(/[^\\]+$/g,'command_constants.txt');
var fso = new ActiveXObject("Scripting.FileSystemObject");
var sh = new ActiveXObject("WScript.Shell");
var e = Editor;

// vbs 関数
var vbs = {
	_control : new ActiveXObject("ScriptControl"),
	_lang    : "VBScript",
	_escape  : function(v){
		return(("" + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "')); // "
	},
	prompt   : function (msg, title, def){
		return(this.eval('InputBox(' +
			'"' + this._escape(msg)         + '", ' +
			'"' + this._escape(title || '') + '", ' +
			'"' + this._escape(def   || '') + '")'));
	},
	alert    : function (msg){
		this.exec('MsgBox("' + this._escape(msg) + '")');
	},
	exec     : function (src){
		this._control.Language = this._lang;
		this._control.AddCode(src);
	},
	eval     : function (src){
		this._control.Language = this._lang;
		this._control.AddCode("Function Hoge() : Hoge = " + src + " : End Function");
		return(this._control.Run("Hoge"));
	}
};

main();

function main(){
	var str = vbs.prompt("実行する拡張子を入力して下さい。\n引数は\",\"区切りで入力。",
		"拡張子の入力",fso.GetExtensionName(e.ExpandParameter("$F")) );
	if (!str) return;
	var l = str.split(",");
	var ext = l[0];
	
	l.shift();
	var args;
	if (l.toString().length <= 0) args = '';
	else args = '"'+l.toString().replace(/,/g," ")+'"';

	ext = ext.replace(/(^\s+|\s+$)/g,"");
	if (ext == null || ext.length <= 0) {
		return;
	}
	
	// 復元用
	e.MoveHistSet();
	
	var path;
	
	// テンポラリパス生成
	do {
		path = getTempPath() + "." + ext;
	} while( fso.FileExists(path) );
	
	// テキストの取得
	if (e.IsTextSelected == 0) e.SelectAll();
	var text = e.GetSelectedString();
	
	// 桁位置を復元
	e.MoveHistPrev();
	
	saveFile(path, text);
	
	var cmd = getCommandByExtension(ext);
	if (!cmd){
		cmd = new Array('\"'+path+'\"');
	}
	cmd = parseCommand(path, cmd, args);
	execCommand(cmd);
	//new ActiveXObject("WScript.Shell").Run('\"'+path+'\"', 1, true);
	//e.ExecCommand('\"'+path+'\"');
	deleteFile(path);
	
}

// テンポラリファイルパス取得
function getTempPath(){
	return fso.GetSpecialFolder(2) + "\\" + fso.getTempName();
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

 // ファイル保存
function saveFile(path, text){
	stream = fso.CreateTextFile( path, true);
	stream.Write( text );
	stream.Close();
	return;
}

// ファイル削除
function deleteFile(path) {
	if (fso.FileExists(path)) fso.DeleteFile(path, true);
}

function getCommandByExtension(ext){
	var text = readFile(SETTING_FILE);
	if (!text) return null;
	text = text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/^#.*\n/gm,'');
	var line = text.split("\n");
	for (var i=0;i<line.length;i++){
		var item = line[i].split("\t");
		if (item.length <= 0) continue;
		if (item[0] == ext) {
			item.shift();
			return item;
		}
	}
	return null;
}

function parseCommand(path, list, args){
	var l = [
		['s',fso.GetParentFolderName(e.ExpandParameter("$S"))],
		['d',fso.GetParentFolderName(path)],	// dir
		['c',sh.Environment("SYSTEM").Item("COMSPEC")]	// cmd.exe
	];
	
	l=l.concat( parseConstants() );
	
	for (var i=0;i<list.length;i++){
		var text = list[i].replace(/%%/g,"\t");
		for (var j=0;j<l.length;j++){
            if (l[j][0]) text = text.replace( new RegExp('%'+l[j][0], "g"), l[j][1]);
		}
		list[i] = text.replace(/\t/g,"%");
	}
	// それっぽく対応
	var sl = [
		['F',path],
		['f',path.replace(/([^\\]+$)/,"$1") ],
		['g',fso.GetBaseName(path) ],
		['/',path.replace(/\\/g,"/") ]
	];
	for (var i=0;i<list.length;i++){
		var text = list[i].replace(/\$\$/g,"\t");
		for (var j=0;j<sl.length;j++){
            if (sl[j][0]) text = text.replace( new RegExp('\\$'+sl[j][0], "g"), sl[j][1]);
		}
		list[i] = text.replace(/\t/g,"$");
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

function execCommand(list){
	var stdout = 0;
	for (var i=0;i<list.length;i++){
		if (!list[i]) continue;
		if (i==0 && !isNaN(list[i]) ) {
			stdout = list[i];
			continue
		}
		try {
			if (stdout == 0) sh.Run(e.ExpandParameter(list[i]),1,true);
			else e.ExecCommand(list[i], stdout);
		} catch ( err ){
			e.TraceOut('original:'+list[i]);
			e.TraceOut('expand  :'+e.ExpandParameter(list[i]));
			e.TraceOut('desc    :'+err.number + "-" + err.description);
		}
	}
}
})();
