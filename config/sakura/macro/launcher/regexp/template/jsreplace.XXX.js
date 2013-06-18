// 全置換
var REGEX = //mig;
var REPLACE_STR = '';

main();

function main(){
	var e = Editor;
	// 桁位置復元用
	e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected == 0) e.SelectAll();
   
	text = e.GetSelectedString(0);//.replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
   
	e.InsText(text.replace(REGEX, REPLACE_STR ) );
//		modifyReturnCode(convertString(text));
	
	// 桁位置を復元
	e.MoveHistPrev();
}

//// 改行コードを現在の文書に合わせる
//function modifyReturnCode(text){
//	var e = Editor;
//	var l = new Array("\r\n","\r","\n");
////	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
//	return text.replace(/\n/g,l[e.GetLineCode()]);
//}

