(function(){
	var e = Editor;
	// 選択なしの場合、全行選択
	if (e.IsTextSelected == 0) e.SelectAll();
	
	// 改行コードを現在の文書に合わせる
	var modifyReturnCode = function(text){
		return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, new Array("\r\n","\r","\n")[Editor.GetLineCode()]);
	};
	
	var strTable = textToHtmlTable( e.GetSelectedString() );
	
	if (strTable.length <= 0) return;
	e.InsText(modifyReturnCode(strTable));
	return;

	// テーブル作成
	function textToHtmlTable(text){
		var indent = "\t";   // インデント文字列
		var td_indent = indent + indent;
		//一行ごとの配列に分ける
		var lines = text.replace(/\r\n+/g,"\n").split("\n");
		var table = ["<table>"];
		for (var i=0, len = lines.length; i<len; i++) {
			if (!lines[i]) continue;
			table.push(indent + "<tr>");
			table.push(td_indent + "<td>" + lines[i].toString().replace(/[,\t]/g,"</td>\n"+td_indent + "<td>") + "</td>");
			table.push(indent + "</tr>");
		}
		if (table.length <= 1) return text;
		table.push("</table>");
		return table.join("\n");
	}
})();
