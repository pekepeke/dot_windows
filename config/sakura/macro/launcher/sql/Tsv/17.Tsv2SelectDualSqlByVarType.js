// tsv から SQL のWHERE句を作成
var numExps = new Array(/smallint/i, /integer/i, /bigint/i, /decimal/i, /numeric/i, 
						/real/i, /double precision/i, /serial/i, /bigserial/i, /number/i );

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
	var isnums = new Array();
	var ret = "";
	if (!line) return ret;
	for (var i=0;i<line.length;i++){
		if (line[i] == null || line[i].replace(/(^\s+|\s+$)/g,"") == '') continue;
		var item=line[i].split("\t");
		if (i<=0) head = item;
		else if (i<=1) {
			for (var j=0; j<item.length; j++){
				for (var k=0; k<numExps.length; k++) {
					if (item[j].match(numExps[k])) {
						isnums[j] = true;
						break;
					}
				}
			}
		} else {
			ret += "SELECT ";
			for (var j=0;j<item.length;j++){
				if(j>0) ret+=","
				if (!isnums[j]) item[j] = "'"+item[j]+"'";
				ret+=" " + item[j] + " AS " + head[j];
			}
			ret += " FROM DUAL;";
			ret+="\n";
		}
	}
	return ret;
}
