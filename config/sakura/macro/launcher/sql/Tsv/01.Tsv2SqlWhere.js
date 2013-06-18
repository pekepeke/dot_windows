// tsv から SQL のWHERE句を作成
main();

function main(){
	var e = Editor;
	//e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
	    e.SelectAll();
	}
	
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	
	e.InsText( modifyReturnCode(
		tsvToSqlWhere(text)
		));
	//e.MoveHistPrev();
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

function tsvToSqlWhere(text) {
	var line=text.split("\n");
	var head;
	var ret = "";
	if (!line) return ret;
	for (var i=0;i<line.length;i++){
		if (line[i] == null || line[i].replace(/(^\s+|\s+$)/g,"") == '') continue;
		var item=line[i].split("\t");
		if (i<=0) head = item;
		else {
			for (var j=0;j<item.length;j++){
				if(j>0) ret+=" AND "
				ret+=head[j] + " = '" + item[j] + "'";
			}
			ret+="\n";
		}
	}
	return ret;
}
