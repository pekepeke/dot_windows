// 翻訳マクロ
// Macro/投稿/178 - SakuraEditorWiki を参考に作成
// http://sakura.qp.land.to/?Macro%2F%C5%EA%B9%C6%2F178
(function(){//})
	var e = Editor;
	// 桁位置復元用
	e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected == 0) e.SelectAll();
   
	text = e.GetSelectedString(0);//.replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	if (!text) {
		e.MoveHistPrev();
		return;
	}
	
	e.InsText( modifyReturnCode(
		convertString(text)
		));
	// 桁位置を復元
	e.MoveHistPrev();

	// 改行コードを現在の文書に合わせる
	function modifyReturnCode(text){
		var e = Editor;
		var l = new Array("\r\n","\r","\n");
	//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
		return text.replace(/\n/g,l[e.GetLineCode()]);
	}

	// 文字列生成
	function convertString(text){
		var url      = 'http://www.google.co.jp/translate_t?';
		var ajax     = new ActiveXObject('MSXML2.XMLHTTP');   
		
		// 翻訳方法の判別
		var langpair = 'ja|en';
		if ( text.match(/^[a-zA-Z]/) ) langpair = 'en|ja';

		// POSTするでー
		ajax.Open( 'POST', url + 'langpair=' + langpair, false );
		ajax.Send( "text=" + encodeURI( text ) );

		//XMLとしてロードできるなら、innerTextとってくりゃ良いんだろうけど。
		var res = ajax.responseText;
		var ret = '';
		if ( res.match( /<div.*id=result_box[^>]+>([^/]+)<\/div>/g ) ) {
			ret = RegExp.$1.replace(/<br>/g,"\n");
			if ( text.match(/[\r\n]+$/)) ret += "\n";
		}
		return ret;
	}
})();
