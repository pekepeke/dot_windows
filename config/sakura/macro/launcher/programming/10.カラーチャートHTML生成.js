(function(){

	var e = Editor;

	//e.MoveHistSet();		// 桁位置復元用
	// 選択範囲がなければ全選択
	if (e.IsTextSelected == 0) e.SelectAll();
  
	text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
  
	e.InsText( modifyReturnCode(
		convertString(text)
		));

	//e.MoveHistPrev();		// 桁位置を復元


// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

// 文字列生成
function convertString(text){
	var delim = (text.indexOf('\t') >= 0) ? "\t" : "\n";
	var list = text.split(delim);
	var ret = "<html>\n" +
					"<head>\n" +
					"<meta http-equiv=\"Content-Type\" content=\"text/html; charset=Shift_JIS\">\n" +
					"<title>color chart</title>\n" +
					"</head>\n" +
					"<body>\n";
	ret += '<table border="1px">\n';
	for (var i=0, l=list.length; i<l ; i++){
		var rgb = list[i].replace(/[^\d,]|\s/g,'').split(",");
		var s_rgb = dec2hex(rgb[0]||0)+dec2hex(rgb[1]||0)+dec2hex(rgb[2]||0);
		ret+='\t<tr><td>'+list[i]+'</td>'+'<td>'+s_rgb+'</td>'+'<td bgcolor="#'+s_rgb+'" width="30px"></td></tr>\n';
	}
	ret += "</table>\n</body>\n</html>";
	return ret;
}
function dec2hex(dec){
	var ret = '00'+_dec2hex(dec).toString();
	return ret.substr(ret.length-2,2);
}

function _dec2hex (dec) {
	var hex = "";
	while( dec ) {
		var last = dec & 15;
		hex = String.fromCharCode(((last>9)?55:48)+last) + hex;
		dec >>= 4;
	}
	return hex+'';
}
})();
