// サクラエディタマクロテンプレ
(function(){//})
	var e = Editor;
	// 桁位置復元用
	e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected == 0) e.SelectAll();
	
	e.TABToSPACE();
	
	text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	
	e.InsText( modifyReturnCode(text.replace(/ +$/m,'') ));
	// 桁位置を復元
	e.MoveHistPrev();
	return;
	
	// 改行コードを現在の文書に合わせる
	function modifyReturnCode(text){
		var e = Editor;
		var l = new Array("\r\n","\r","\n");
	//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
		return text.replace(/\n/g,l[e.GetLineCode()]);
	}

})();
