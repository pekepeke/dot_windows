// mysql の出力結果を TSVにフォーマットする
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
	
	var sql = getConvertText(text);
	if (sql.length<=0) return;
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
function getConvertText(text){
	text = text.replace(/([\r\n]+\|[^\r\n]+[^ \|\r\n])[\r\n]+/g,'$1').replace(/^[^\n\+\|].+/gm,'');
	return text.replace(/^[\+\-\r\n]+$/gm,'').replace(/([^\|][^ \|])[\r\n]+/g,'$1')
			.replace(/^\| +| +\|$/gm,'').replace(/ *\| +/gm,"\t").replace(/^\n/m,'');		// カラム内の改行は無視する
//	return text.replace(/^[\+\-\r\n]+$/gm,'').replace(/([^\|][^ \|])[\r\n]+/g,'$1')
//			.replace(/^\| +| +\|$/gm,'').replace(/ +\| +/gm,"\t").replace(/^\n/m,'');		// カラム内の改行は無視する
	//return text.replace(/^[\+\-\r\n]+$/gm,'').replace(/^\| +| +\|$/gm,'').replace(/ +\| +/gm,"\t").replace(/^\n/m,'');		// カラム内の改行は考慮しない
	//return text.replace(/([^\|][^ ])[\r\n]+/g,'$1\r').replace(/^[\+\-\r\n]+$/gm,'').replace(/^\| +| +\|$/gm,'').replace(/ +\| +/gm,"\t").replace(/^\n/m,'');		// カラム内の改行はCRにする
}

