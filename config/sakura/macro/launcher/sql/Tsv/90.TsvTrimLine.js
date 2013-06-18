(function(){
	var e = Editor;
	//e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
   
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	if (!text) return;
	
	e.InsText( modifyReturnCode(
		getConvertString(text)
		));
	//e.MoveHistPrev();

	// 改行コードを現在の文書に合わせる
	function modifyReturnCode(text){
		var e = Editor;
		var l = new Array("\r\n","\r","\n");
		return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	}

	// 文字列生成
	function getConvertString(text){
		return text.replace(/^[ \t]+$/gim,'').replace(/\n+/g,'\n');
	}

})();

