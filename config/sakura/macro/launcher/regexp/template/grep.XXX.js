// 全置換
var e = Editor;
var SOURCE = '^[ \\t]*[\\r\\n]+';
var SEARCH_FILE = '*.*;!entries;!all-wcprops;!*.svn*;!*.bak;!*.tmp;!*.dat;!*.~???;!*.*~';		// ファイルマスク
//var SEARCH_FILE = e.ExpandParameter('$F').replace(/(^\\]+)$/g,'$1');							// 自ファイル名
var SEARCH_DIR = e.ExpandParameter('$F').replace(/[^\\]+$/g,'');
var DLG_STATE = '0110001101111001';
//				 5432109876543210
//bit 内容 
//0 サブフォルダからも検索する 
//1 - No Use - 
//2 英大文字と小文字を区別する 
//3 正規表現 
//4 文字コードセット自動選択 
//5 0=該当部分 / 1=該当行 
//6 0=ノーマル / 1=ファイル毎 
//15～8 文字コードセット 
//		00000000(0) Shift_JIS 
//		00000001(1) JIS 
//		00000010(2) EUC 
//		00000011(3) Unicode 
//		00000100(4) UTF-8 
//		00000101(5) UTF-7 
//		00000110(6) UnicodeBE 
//		01100011(99) 自動選択 

var NOFILE = '(無題)';

main();

function main(){
	//e.TraceOut(parseInt(DLG_STATE, 2));
	if (SEARCH_DIR && SEARCH_FILE && SEARCH_FILE != NOFILE) 
		e.Grep(SOURCE, SEARCH_FILE, SEARCH_DIR, parseInt(DLG_STATE, 2) );
}
