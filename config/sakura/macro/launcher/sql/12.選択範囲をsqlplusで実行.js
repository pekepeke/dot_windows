// sqlplus で実行
var _CMD = "sqlplus sst1/sst1@xe";

var _SETLINES = 1000;		// 出力制御
var _ROWNUM = 10;			// 出力制限用(出力制限を行わない場合、負の値を設定)

main();

function main(){
	var e = Editor;
	//e.MoveHistSet();

	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
	
	var header = "set lines "+_SETLINES+"\n";
	// 変換
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	if (!text) return;
	
	text = getCleanSqlText(text);
	//if ( _ROWNUM >= 0 ) text = text.replace(/;/gm, "");

	if ( _ROWNUM >= 0 && isSelectSql(text) && text.indexOf(";") < 0){
		header+="SELECT * FROM (";
		text = text + ") WHERE ROWNUM <= " + _ROWNUM;
	}
	text = header + text + ";\nexit";
	text = text.replace(/([ \t\r\n]*;)+/g, ";");
	var path = getTempPath();
	saveFile( path, text);

	var cmd = _CMD + ' "@' + path + '"';

	e.TraceOut(text);
	e.ExecCommand(cmd, 1);
	e.ActivateWinOutput();
	deleteFile( path );

	//e.MoveHistPrev();
}

// テンポラリファイルパス取得
function getTempPath(){
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	return fs.GetSpecialFolder(2) + "\\" + fs.getTempName();
}

// ファイル保存
function saveFile(path, text){
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	stream = fs.CreateTextFile( path, true);
	stream.Write( text );
	stream.Close();
	return;
}

// ファイル書き込み
function deleteFile(path) {
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	fs.DeleteFile(path, true);
}

// select 文かどうかを判定
function isSelectSql(sql) {
	ret = text.search(/^[ \t\r\n]*SELECT/i)
	if (ret < 0) return false;
	return true;
}

// 空行削除
function getCleanSqlText(text) {
	text = text.replace(/[ \t]+([\r\n]+)$/gm, "$1");
	text = text.replace(/^[ \t]*[\r\n]+/gm, "");
	//text = text.replace(/^[ \t]*[\r\n]+/gm, "-- \n");
	return text;
}

