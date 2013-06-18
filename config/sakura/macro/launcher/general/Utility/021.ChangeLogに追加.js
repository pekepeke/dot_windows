// changelog に追加
var sh = new ActiveXObject("WScript.Shell");
var FILENAME = "\\changelog.txt";						// not modify!!
var changelogpath = getSakuraEditorPath() + FILENAME;	// save changelog path(if empty => MyDocuments)
var mymail = "<" + sh.ExpandEnvironmentStrings("%USERMAIL%") + ">";					// mail
var myname = sh.ExpandEnvironmentStrings("%USERNAME%");									// name

main();

function main(){
	if (checkChangelogFileOpen()) addChangelogLine();
	else openChangelogFile();
}

// changelog ファイルかチェック
function checkChangelogFileOpen(){
	if ( Editor.GetFilename().indexOf(FILENAME)>0 ) return true;
	return false;
}

// 文字列追加
function addChangelogLine(){
	var e = Editor;
	
	var dt = new Date();
	var m = "0" + (dt.getMonth()+1);
	var d = "0" + dt.getDate();
	var today = dt.getYear() + "-" + m.substr(m.length-2) + "-" + d.substr(d.length-2);
	
	var len = e.GetLineCount(0);
	if (len > 10) len = 10;			// 高速化
	var todaypos = 0;
	for (var i=1; i<=len; i++){
		if (e.GetLineStr(i).substr(0,10) == today){
			todaypos = i;
			break;
		}
	}
	var text = "";
	var endlf;
	if (todaypos == 0){
		e.GoFileTop();
		text += "\n" + today + "  " + myname + "  " + mymail + "\n";
		endlf="\n\n";
	} else {
		e.Jump(todaypos+1, 1);
		endlf="\n";
	}
	text += "\n\t* : " + endlf;
	e.InsText(modifyReturnCode(text));
	e.Jump(4,1);
	for (var i=0; i<3; i++) e.Right();
}

// changelogを開く
function openChangelogFile(){
	if (changelogpath.length <=0){
		changelogpath = new ActiveXObject("WScript.Shell").SpecialFolders("MyDocuments") + FILENAME;
	}
	Editor.FileOpen(changelogpath);

}
// サクラエディタのパス取得
function getSakuraEditorPath(){
	return Editor.ExpandParameter("$S").replace(/[^\\]+$/g,"");
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}
