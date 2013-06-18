/**
 *  コメントを生成マクロ
 * @author 
 * @copyright 
 * @license 
 * @version 
 * @filesource 
 * @link 
 * @see 
 * @since 
 */

// デフォルト値
var defaultVal = {
	'version'	: '1.00',
	'copyright'	: '',
	'license'	: '',
	'author'	: '',
	'date'		: today()
};

// コメント生成オブジェクト(Template)
// start, end, header, dispatch は必ず定義が必要
// dispatch の戻りは null か ret.type を格納し返却すること。
// ret.type に指定したハッシュ関数でコメントを生成します。(ret.type==''は実行しない)
// コメント作成用のハッシュ関数では dispatch の戻り値が受け取れます。
//var creatorTemplate = {
//	'start'		: "" ,
//	'end'		: "" ,
//	'header'	: function() {
//		return ''
//	},
//	'dispatch'	: function(text) {
//		if (text.length <=0) return null;
//		var ret = new Array;
//		ret.type = '';
//		ret.param = new Array();
//	},
//	'function'	: function(info) {
//		return '';
//	}
//};

// js,php 用
var jsCreator = {
	'start'		: "/**\n" ,
	'end'		: " */\n" ,
	'header'	: function(){
		return	" * \n"
				+" * @package \n"
				+" * @author " + defaultVal.author + "\n"
				+" * @copyright " + defaultVal.copyright + "\n"
				+" * @license " + defaultVal.license + "\n"
				+" * @version " + defaultVal.version + "\n"
				+" * @filesource \n"
				+" * @link \n"
				+" * @see \n"
				+" * @since " + defaultVal.date + "\n";
	} ,
	'dispatch'	: function(text){
		var item = text.match(/[\$a-zA-Z0-9_]+|\(|\)/g);
		var len = item.length;
		if (len <= 0) return null;
		
		var ret = new Array;
		ret.type = item[0];
		ret.param = new Array();
		if (ret.type == 'function'){
			for (var i=3; i<len && item[i] != ')';i++) ret.param.push( item[i] );
		} else if (ret.type == 'class'){
		} else if (ret.type == 'var'){
			if (len > 1) ret.param.push( item[1] );
		} else {
			ret.type = '';
		}
		return ret;
	} ,
	'class'		: function(info){
		return   " * \n"
				+" * @package \n";
	} ,
	'function'	: function(info){
		var s='';
		objtrace(info.param.length);
		for (var i=0;i<info.param.length;i++) s+= " * @param " + info.param[i] +" : \n";
		return   " * \n"
				+" * @return \n"
				+" * @throws \n"
				+s;
	} ,
	'var'		: function(info){
		var s="";
		for (var i=0;i<info.param.length;i++) s+= " * @var " + info.param[i] +" : \n";
		return s;
	} 
};
// cpp 用
var cppCreator = {
	'start'		: "/**\n" ,
	'end'		: " */\n" ,
	'header'	: function() {
		return   " * \n"
				+" * @file \n" + Editor.ExpandParameter("$N");
				+" * @author " + defaultVal.author + "\n"
				+" * @date " + defaultVal.date + " " + "\n"
				+" * @note " + defaultVal.date + " " + defaultVal.author + "\n"
				+" * @version $Id: " + defaultVal.version + "\n"
	},
	'dispatch'	: function(text) {
		text = text.replace(/[\r\n]+|^\s+/g,"");
		var item = text.match(/[_a-zA-Z0-9:]+|\(|\)/g);
		if (!item) return null;
		
		var len = item.length;
		var ret = new Array;
		ret.type = '';
		ret.param = new Array();
		
		var keyword = new Array('if','switch','else','return','for');
		var keylen = keyword.length;
		
		if (item[0] == 'class'){
			ret.type = 'class';
		} else {
			var p = -1;
			for (var i=1; i<len && item[i] != ')'; i++){
				if (item[i] == '('){
					ret.type = 'function';
					ret.name = item[i-1];
					if (i>1) ret.ret = item[i-2];
					else ret.ret = '';
					p = i;
				} else if ( p > -1 &&(i-p)%2 == 0) {
					ret.param.push(item[i]);
				} else {
					for (var j=0; j<keylen; j++) {
						if (item[i] == keyword[j]) return ret;
					}
				}
			}
		}
		return ret;
	},
	'function'	: function(info) {
		var s='';
		objtrace(info.param.length);
		var tmp = info.ret.toLowerCase();
		if (tmp == 'bool')  s+= " * @return true  :\n" + " * @return false :\n";
		else if (tmp != '') s+= " * @return \n";
		for (var i=0;i<info.param.length;i++) s+= " * @param " + info.param[i] +" : \n";
		
		return  " * \n"
				+s
				+" * @date " + defaultVal.date + " " + "\n"
				+" * @note " + defaultVal.date + " " + defaultVal.author + "\n";
	}
};

// 生成するコメント対象の拡張子と
// コメント作成オブジェクトをセット
var commentCreator = {
	'js' : jsCreator,
	'php': jsCreator,
	'cpp': cppCreator,
	'c'  : cppCreator,
	'h'  : cppCreator,
	'cc' : cppCreator,
	'cp' : cppCreator,
	'c++': cppCreator
};
main();

/**
 * デバッグ出力
 * @return なし
 * @param msg : 
 */
function trace(msg){
//	return;
	var e = Editor;
	e.TraceOut(msg);
}

/**
 * デバッグ出力
 * @return なし
 * @param obj : オブジェクト
 */
function objtrace(obj){
	return;
	var s;
	for (key in obj){
		s += key + "=" + obj[key] + ",";
	}
	trace("-----------------------------------------------");
	trace(s);
	trace("-----------------------------------------------");
}

/**
 * メイン関数
 * @return なし
 */
function main(){
	try {
		var e = Editor;
		var ext = new ActiveXObject("Scripting.FileSystemObject").GetExtensionName(Editor.GetFilename).toLowerCase();
		var creator = commentCreator[ext];
		
		objtrace(creator)
		
		if (!creator) throw("対応していない形式です");
		
		var line;
		if ( e.IsTextSelected() ) {
			line = e.GetSelectedString(0);
		} else {
			line = e.GetLineStr(0);
		}
		if (line.length == 0) throw("現在行に文字がありません");
		var indent = getIndentString(line);
		
		var text = '';
		if ( isFileHeader() ) {
			text = creator.start + creator.header() + creator.end;
			putText(indent,text);
			return;
		}
		
		var info = creator.dispatch(line);
		if (!info || info.type.length<=0) throw("コメント付加対象ではありません");
		
		objtrace(info);
		
		text = creator.start + creator[info.type](info) + creator.end;
		putText(indent,text);
	} catch (e) {
		var m;
		if (e.description) m = e.name + ":" + e.description + "(" + e.number + ")" + e.message;
		else m = e;
		alert(m);
	}
	return;
}

/**
 * インデントを取得
 * @return インデント文字列
 * @param text : 選択文字列 or 現在行文字列
 */
function getIndentString(text){
	return text.match(/^[ \t]*/);
}

/**
 * テキストを出力
 * @return なし
 * @param indent : インデント文字列
 * @param text : 出力文字列
 */
function putText(indent, text){
	var e = Editor;
	if ( e.IsTextSelected() ) e.Left();
	else e.GoLineTop(1);
	text = text.replace(/^(.+)/gm,indent+"$1");
	e.InsText( modifyReturnCode(text) );
}

/**
 * 改行コードを現在の文書に合わせる
 * @return 改行コードを修正した文字列
 * @param text : 文字列
 */
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

/**
 * ファイルの先頭付近かどうかを判定
 * @return true  : ヘッダー
 * @return false : ヘッダー以外
 */
function isFileHeader(){
	var e = Editor;
	if ( !e.IsTextSelected() ) {
		e.GoLineTop();
		e.GoLineEnd_Sel();
	}
	if (e.GetSelectLineFrom() <= 2) return true;
	return false;
}

/**
 * 今日の日付を返却
 * @return 今日の日付
 */
function today(){
	var d = new Date();
	var mm = "0"+(d.getMonth()+1);
	var dd = "0"+d.getDate();
	var today = d.getYear() +"/"+ mm.substr(mm.length-2) +"/"+ dd.substr(dd.length-2);
	return today;
}

// WSH用alert
function alert(msg) {
	if (typeof(_g_control) == 'undefined') {
		_g_control = new ActiveXObject("ScriptControl");
		_g_control.Language = "VBScript";
	}
	_g_control.AddCode('Call MsgBox("' + _vbescape(msg) +'")');
}

function _vbescape(v) {
	return ("" + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "'); // "
}
