// Map のデバッグ表示文字→TSVに変換
main();

function main(){
	var e = Editor;
	e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
   
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	if (!text) return;
	
	e.InsText( modifyReturnCode(
		getTsvString(text)
		));
	e.MoveHistPrev();
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

// 文字列生成
function getTsvString(text){
	return text.replace(/,/g,"\n")
		.replace(/=/g,"\t")
		.replace(/ +/g,"")
		.replace(/[{}]/g,"");
}

