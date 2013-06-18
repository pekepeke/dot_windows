// autobind to sql statement
main();

function main(){
	var e = Editor;
	// 桁位置復元用
	//e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
   
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	if (!text) return;
	
	e.InsText( modifyReturnCode(
		getSqlString(text)
		));
	// 桁位置を復元
	//e.MoveHistPrev();
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

// 文字列生成
function getSqlString(text){
	var regex = /SQL\[([^]]*)\] BINDS\[([^]]*)\]/;
	text = text.replace(/\n/g, '');
	
	text.match(regex);
	sqltext = RegExp.$1;
	bindtext = RegExp.$2;
	
	// unformat
	sqltext = sqltext.replace(/[ \t]+/g, " ");
	
	binds = bindtext.split(" ");
	for (var i=0; i<binds.length; i++) {
		if (binds[i].length <= 0) continue;
		var param = binds[i].replace(/^[^=]*=/, '');
		sqltext = sqltext.replace('?', "'"+ param +"'");
	}
	return sqltext + "\n";
}

