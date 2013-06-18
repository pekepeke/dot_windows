// コメント化・解除
(function(){	//}}

var e = Editor;
var Formatter = function(){ this.initialize.apply(this,arguments) };
Formatter.prototype = {
	initialize: function(){
		this.copy('c', 		['cc','cp','cpp','c++','h','java','jav','jad','php','inc','cs','js','dms','hta','html','htm'] );
		this.copy('vbs',	['bas','frm','cls']);
		this.copy('pl',		['cgi','pm','sh','rb','yaml','properties','py']);
		this.copy('el',		['l']);
		this.copy('xml',	['shtm','shtml']);
		this.copy('bat',	['cmd']);
		this.copy('ini',	['inf']);
	},
	c		: '//',
	vbs	: "'",
	pl	: '#',
	ini	: ';',
	bat	: 'rem ',
	el	: ';',
	sql	: '--',
	vm	: '##',
	xml: { start: '<!-- ', end: '-->' },
	css	: { start: '/* ', end: ' */' },
	copy: function( src, list) {
		for (var i=0,l=list.length; i<l; i++) this[list[i]] = this[src];
	}
}

main();


function main(){
	if (e.IsTextSelected() == 0) return;

	// 変換
	var result = e.GetSelectedString(0);			   // 選択範囲の文字列を取得
	//var ext = fso.GetExtensionName(e.GetFilename);
	var ext = e.GetFilename.match(/[^\.]+$/);
	if (!ext || ext.length <= 0) {
		ext = InputBox('拡張子を入力して下さい。');
		if (!ext) return;
	}
	ext = (ext+'').toLowerCase();
	var _s = new Formatter();
	var s = _s[ext];
	if (typeof s == 'undefined') return;
	text = e.GetSelectedString(0).replace(/\r\n/g,'\n').replace(/\r/g,'\n');	// 改行を\nで統一
	
	var eoflf=false;
	if (text.slice(-1) == '\n') {
		eoflf = true;
		text = text.replace(/\n$/,'');
	}
	var start = typeof s == 'object' ? s.start : s;
	var end = typeof s == 'object' ? s.end : '';
	
	if (text.substr(0, start.length) == start) {
		if (!end) text = text.replace(new RegExp('^'+start,'gim'),'');
		else text = text.replace(new RegExp('^'+start+ '|'+end+'$','gim'), '');
	} else {
		if (!end) text = text.replace(/^/gm,start);
		else text = start + text + end;
	}
	if (eoflf) text+='\n';
   
	e.InsText( modifyReturnCode(
		text
		));
}

// Javascript 版 InputBox
function InputBox( msg ){
	var VBS_CODE = 'inputbox("' + msg + '")';
	var scriptCtl = new ActiveXObject('ScriptControl');
	scriptCtl.Language = 'VBScript';
	return scriptCtl.Eval(VBS_CODE);
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array('\r\n','\r','\n');
//	return text.replace(/\r\n/g,'\n').replace(/\r/g,'\n').replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}
})();
