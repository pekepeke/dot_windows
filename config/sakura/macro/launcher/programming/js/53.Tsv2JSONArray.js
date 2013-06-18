// Array -> JSON + Array
var e = Editor;

main();

function main(){
	// 桁位置復元用
	e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected == 0) e.SelectAll();
   
	text = e.GetSelectedString(0).replace(/\r\n/g,"\n");//.replace(/\r/g,"\n");	// 改行を\nで統一
   
	e.InsText( modifyReturnCode(
		convertString(text)
		));
	// 桁位置を復元
	e.MoveHistPrev();
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

// 文字列生成
function convertString(text){
	text = text.replace(/\r/g,'\\n').replace(/^"|"$/mg,'').replace(/\n$/g,'');
	var line = text.split("\n");
	
	if (line.length <= 1) return;
	var head = line[0].split("\t");
	var ret = [];
	for (var i=1,l=line.length; i<l ;i++){
		var list = line[i].split("\t");
		ret.push( arrayToJSON(head, list) );
	}
	if (ret.length == 1) return ret[0];
	return "[" + ret.join(", ") + "];";
}

function arrayToJSON(head, data){
	var ret = [];
	var len = head.length > data.length? data.length: head.length;
	for (var i=0; i<len; i++){
		ret.push(head[i]+':"'+data[i]+'"');
	}
	return "{\n\t"+ret.join(",\n\t")+"\n}";
}
