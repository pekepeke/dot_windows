// SQL をアンフォーマットする
main();

function main(){
	var e = Editor;
	//e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
	
	text = e.GetSelectedString(0);
	if (!text) return;
	
	var sql = getUnFormatSql(text);
	if (sql.length<=0) return;
	sql+="\n";
	e.InsText( modifyReturnCode(sql) );
	//e.MoveHistPrev();
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

// 文字列生成
function getUnFormatSql(text){
	return text.replace(/[\r\n]+/g," ")
		.replace(/\s+/g," ")
		.replace(/\s*,\s*/g,", ")
		.replace(/\s*=\s*/g," = ");
}

