// tsv から SQL のWHERE句を作成
main();

function main(){
	var e = Editor;
	//e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
	    e.SelectAll();
	}
	
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	if (!text) return;
	
	e.InsText( modifyReturnCode(
		convertString(text)
		));
	//e.MoveHistPrev();
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

function convertString(text) {
	if (!symbol) symbol = prompt("SQL修飾子を入力してください。","SQL修飾子の入力","A");
	return text.replace(/([^ \t=\(']+)[ \t]*(=|\|\||BETWEEN)[ \t]*/ig,symbol+".$1 $2 ");	//')
}
// WSH用prompt
function prompt(msg, title, def){
	alert(typeof(_g_control));
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

