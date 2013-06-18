main();

function main(){
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
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

// 文字列生成
function getConvertString(text){
	var _line=text.split("\n");
	var matrix = [];
	var regex = /[^\d,]/;
	
	for (var i=0, l=_line.length; i<l ; i++) {
		var list = _line[i].split("\t");
		for (var j=0, ll=list.length; j<ll ;j++) {
			if (i==0) matrix.push([list[j]]);
			else if (matrix.length > j && list[j]) matrix[j].push(list[j]);
			// else -> do nothing
		}
	}
	
	var line = [];
	for (var i=0, l=matrix.length; i<l ; i++){
		var head = matrix[i].shift();
		var str = matrix[i] + "";
		if (regex.test(str)) str = "'" + str.replace(/,/g, "','") + "'";
		line.push( head + " in (" + str + ")");
	}
	
	return line.join("\n");
}

