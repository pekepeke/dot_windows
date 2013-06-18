// サクラエディタマクロテンプレ
(function(){//}()
	var e = Editor;
   
	e.InsText( modifyReturnCode(
		getString()
		));
	return;

	// 改行コードを現在の文書に合わせる
	function modifyReturnCode(text){
		var e = Editor;
		var l = new Array("\r\n","\r","\n");
	//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
		return text.replace(/\n/g,l[e.GetLineCode()]);
	}

	// 文字列生成
	function getString(){
		return generateGUID()+"\n";
	}

	function generateGUID() {
		try {
			var x = new ActiveXObject("Scriptlet.TypeLib");
			// Note: GUID contains \0 !!
			return x.GUID.replace(/\0|\\/g,"");//.replace(/[{}\0]/g, "" ).replace(/-/g,"_");
		}
		catch (e) {
			// set default string if GUID is not available
			return ("_GUARD_");
		}
	}
})();
