// http://blogs.wankuma.com/pinzolo/archive/2007/11/10/107472.aspx
// のEmEditorをサクラエディタでも…


/*
 * XML をフォーマットします。
 */
// フォーマット後の文字列バッファ
var _buff = "";

// インデント階層
var _indentLevel = 0;

// テキストノードが追加されたかどうか
var _isTextAppend = false;

// インデントに使用する文字列
var _indent = "\t"

// 改行文字
var _newLine = getReturnCode();		//"\r\n";

var dom = new ActiveXObject("Microsoft.XMLDOM");
// XPath が使用できるように
dom.setProperty("SelectionLanguage", "XPath");
dom.async = false;

main();

function main(){
	var e = Editor;
	//var activeDoc = editor.activeDocument;
	//activeDoc.selection.selectAll();

	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}

	// 変換
	var text = e.GetSelectedString(0);		 // 選択範囲の文字列を取得
	
	try {
		dom.loadXML(text);
	} catch (exp) {
		e.TraceOut(exp.description);
	}

	var root = dom.documentElement;
	if (!root) return;
	
	// XML 宣言などルート要素以前の要素を追加
	_buff += text.substring(0, text.indexOf("<" + root.nodeName));
	
	// フォーマット後の XML を作成
	formatNode(root);
	//activeDoc.selection.text = _buff;
	e.InsText(_buff);
}

// 内部使用関数宣言
/*
 * 指定のノードの XML をフォーマットしてバッファに追加します。
 */
function formatNode(node) {
	if (node.nodeType == 1) { // ELEMENT ノード
		_buff += _newLine;
		// インデントを追加
		for (var ti = 0; ti < _indentLevel; ti++) {
			_buff += _indent;
		}
		// 開始タグを追加
		_buff += node.xml.substring(0, node.xml.indexOf(">") + 1);
		_isTextAppend = false;

		// 子ノードがあれば、全子ノードに対して再起処理を行う
		if (node.childNodes.length > 0) {
			// インデントレベルをインクリメント
			_indentLevel++;
			for (var ci = 0; ci < node.childNodes.length; ci++) {
				// 各子要素について再起処理
				formatNode(node.childNodes.item(ci));
			}
			// インデントレベルをデクリメント
			_indentLevel--;

			// テキストノードの直後は改行もインデントも追加しない
			if (! _isTextAppend) {
				_buff += _newLine;
				for (var ti = 0; ti < _indentLevel; ti++) {
					_buff += _indent;
				}
			}

			// 終了タグ
			_buff += "</" + node.nodeName + ">";
			_isTextAppend = false;
		} else if (! _buff.substring(0, _buff.length - 2) == "/>") {
			// 終了タグのある空要素の場合
			_buff += "</" + node.nodeName + ">";
			_isTextAppend = false;
		}
	} else if (node.nodeType == 3) { // TEXT ノード
		// テキストノードはそのまま追加
		_buff += node.nodeValue;
		_isTextAppend = true;
	} else {
		// その他のノードはインデントしてそのまま追加
		_buff += _newLine;
		// タブを追加
		for (var i = 0; i < _indentLevel; i++) {
			_buff += _indent;
		}
		_buff += node.xml;
		_isTextAppend = false;
	}
}

function getReturnCode(){
	var l = new Array("\r\n","\r","\n");
	return l[Editor.GetLineCode()];
}

function alert(msg){
	var script = new ActiveXObject("ScriptControl");
	script.Language = "VBScript";
	var m=(''+msg).replace(/"/g, '""').replace(/[\r\n]+/g, '" & vbCrLf & "'); // "
	script.AddCode('MsgBox("'+m+'")');
}
