// native2ascii もどき
main();

function main(){
	var e = Editor;
	// 桁位置復元用
	e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
   
	var text = e.GetSelectedString(0);
   
	text = escape(text);                                // エンコード
	text = text.replace(/%(u[0-9a-fA-F]{4})/g, "\\$1"); // 4 桁のものだけ %u → \u
	text = unescape(text);                              // 残ったものをデコード

	// 結果を入力
	e.InsText(text);
	// 桁位置を復元
	e.MoveHistPrev();
}

