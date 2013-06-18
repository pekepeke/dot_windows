(function(){
	var e = Editor;
	
	// 改行コードを現在の文書に合わせる
	function modifyReturnCode(text){
		var e = Editor;
		var l = new Array("\r\n","\r","\n");
	//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
		return text.replace(/\n/g,l[e.GetLineCode()]);
	}

	// 文字列生成
	function convertString(text){
		return encodeURIComponent(text);
	}
	
	// 桁位置復元用
	e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected == 0) e.SelectAll();
   
	text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	if (!text) {
		e.MoveHistPrev();
		return;
	}
   
	e.InsText( modifyReturnCode(
		convertString(text)
		));
	// 桁位置を復元
	e.MoveHistPrev();
})();

