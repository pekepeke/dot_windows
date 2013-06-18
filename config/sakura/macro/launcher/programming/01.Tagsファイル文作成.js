// Tagsƒtƒ@ƒCƒ‹•¶‚ğì¬
(function(){
	var e = Editor;
	e.TraceOut( [
			e.ExpandParameter("$F($y,$x)  [") ,
			["SJIS", "JIS", "EUC", "UNICODE", "UTF-8", "UTF-7", "UNICODE-BE"][ e.GetCharCode() ] ,
			"]:" ,
			e.GetLineStr(0)].join(""), 2);
})();
