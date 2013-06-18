// PythonIndentプラグイン indent.js
// @date 2010.03.24 syat 新規作成

//カーソルのある行番号
var nCurLine = parseInt(Editor.ExpandParameter("$y"));
var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
//タブ幅
var nTabSize = Editor.ChangeTabWidth( 0 );
//インデント文字列の作成
var indentUnit = "";
for (var i=0; i<nTabSize; i++) {
	indentUnit += " ";
}
var do_indent = false;
var prev_indent = "####";

//編集中文書を1行ずつ読み込んで解析する
for ( var line_no = 1; line_no <= Editor.GetLineCount( 0 ) + 1; line_no++ ) {
	var line_str = Editor.GetLineStr( line_no );
	line_str = line_str.replace(/[\r\n]/g, "");			//改行を取り除く

	//カーソル行に来たらインデントして終了する
	if (line_no == nCurLine && do_indent && line_str == prev_indent) {
		Editor.InsText( indentUnit );
		break;
	}

	prev_indent = line_str.replace(/^( *).*$/, "$1");

	if (/^ *(if|elif|else|for|while|try|except|finally|def|class) /.test(line_str)) {
		do_indent = true;
	} else {
		do_indent = false;
	}

}

