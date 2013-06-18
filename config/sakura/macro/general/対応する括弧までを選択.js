// 対応する括弧までを選択

var e = Editor;

main();

function main() {
	// 移動前の位置を記憶
	var y1 = Number(e.ExpandParameter('$y'));
	var x1 = Number(e.ExpandParameter('$x'));

	e.BracketPair();	// 対応する括弧に移動

	// 移動後の位置を記憶
	var y2 = Number(e.ExpandParameter('$y'));
	var x2 = Number(e.ExpandParameter('$x'));

	// 元に戻る
	e.BracketPair();

	if ( y1 == y2 && x1 == x2 ) {
		return;
	} else {
		if (y1 > y2 || (y1 == y2 && x1 > x2)) e.BracketPair();	// 閉じ括弧にいる場合（移動前 > 移動後）
		
		e.BeginSelect();	// 選択開始
		
		e.BracketPair();	// 選択範囲の末尾に移動
		e.Right_Sel();		// 右にカーソル移動
		
		e.BeginSelect();	// 選択範囲変更中になるので解除
	}
}
