// 全置換
var SOURCE = '';
var REPLACE_STR = '';
var DLG_STATE = '0010110100';
//				 9876543210
//bit 内容 
//0 単語単位で探す  
//1 英大文字と小文字を区別する  
//2 正規表現  
//3 見つからないときにメッセージを表示  
//4 置換ダイアログを自動的に閉じる  
//5 先頭（末尾）から再検索する  
//6 クリップボードから貼り付ける  
//7 0=ファイル全体 / 1=選択範囲  
//9,8 00=選択文字 / 01=選択始点挿入 / 10=選択終点追加  

main();

function main(){
	var e = Editor;
	//e.TraceOut(parseInt(DLG_STATE, 2));
	e.ReplaceAll(SOURCE, REPLACE_STR, parseInt(DLG_STATE, 2) );
}
