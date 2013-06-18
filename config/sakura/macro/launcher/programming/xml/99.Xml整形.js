function XmlFormatter() {
	this.buff = "";				// フォーマット後の文字列バッファ
	this.dom;
	this.initialize.apply(this, arguments);
}

XmlFormatter.prototype = {
	initialize : function(){
		this.dom = new ActiveXObject("Microsoft.XMLDOM");
		this.dom.setProperty("SelectionLanguage", "XPath");	// XPath が使用できるように
		this.dom.async = false;
	},
	fso : new ActiveXObject("Scripting.FileSystemObject"),
	indentLevel : 0,		// インデント階層
	isTextAppend : false,	// テキストノードが追加されたかどうか
	indent : "\t",			// インデントに使用する文字列
	newLine : "\n",			// 改行文字
	formatXml : function(text) {
		this.buff = "";
		this.dom.loadXML(text);
		return this.formatMain(text);
	},
	// ファイルパス
	formatFile : function(path) {
		var ForReading = 1;
		this.buff = "";
		//if (!fso.FileExists(path)) return;
		var s = this.fso.OpenTextFile(path, ForReading);
		var text = s.ReadAll();
		s.Close();
		return this.formatMain(text);
	},
	// フォーマット
	formatMain : function(text) {
		var root = this.dom.documentElement;
		if (!root) return;
		//if (!text) text = root.xml;
		
		// XML 宣言などルート要素以前の要素を追加
		this.buff += text.substring(0, text.indexOf("<" + root.nodeName));
		
		// フォーマット後の XML を作成
		this.formatNode(root);
		return this.buff;
	},
	// 任意の要素を整形
	formatNode : function(node) {
		if (node.nodeType == 1) { // ELEMENT ノード
			this.buff += this.newLine;
			// インデントを追加
			for (var ti = 0; ti < this.indentLevel; ti++) {
				this.buff += this.indent;
			}
			// 開始タグを追加
			this.buff += node.xml.substring(0, node.xml.indexOf(">") + 1);
			this.isTextAppend = false;

			// 子ノードがあれば、全子ノードに対して再起処理を行う
			if (node.childNodes.length > 0) {
				// インデントレベルをインクリメント
				this.indentLevel++;
				for (var ci = 0; ci < node.childNodes.length; ci++) {
					// 各子要素について再起処理
					this.formatNode(node.childNodes.item(ci));
				}
				// インデントレベルをデクリメント
				this.indentLevel--;

				// テキストノードの直後は改行もインデントも追加しない
				if (! this.isTextAppend) {
					this.buff += this.newLine;
					for (var ti = 0; ti < this.indentLevel; ti++) {
						this.buff += this.indent;
					}
				}

				// 終了タグ
				this.buff += "</" + node.nodeName + ">";
				this.isTextAppend = false;
			} else if (! this.buff.substring(0, this.buff.length - 2) == "/>") {
				// 終了タグのある空要素の場合
				this.buff += "</" + node.nodeName + ">";
				this.isTextAppend = false;
			}
		} else if (node.nodeType == 3) { // TEXT ノード
			// テキストノードはそのまま追加
			this.buff += node.nodeValue;
			this.isTextAppend = true;
		} else {
			// その他のノードはインデントしてそのまま追加
			this.buff += this.newLine;
			// タブを追加
			for (var i = 0; i < this.indentLevel; i++) {
				this.buff += this.indent;
			}
			this.buff += node.xml;
			this.isTextAppend = false;
		}
	}
}

function main(){
	var e = Editor;

	e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}

	// 変換
	var text = e.GetSelectedString(0);		 // 選択範囲の文字列を取得
//	try {
		var formatter = new XmlFormatter();
		text = formatter.formatXml(text);
//	} catch (exp) {
//		e.TraceOut(exp.description);
//		e.MoveHistPrev();
//		return;
//	}
	e.InsText(modifyReturnCode(text));
	e.MoveHistPrev();
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

main();
