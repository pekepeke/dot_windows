
var vbs = {
	_control : new ActiveXObject("ScriptControl"),
	_lang    : "VBScript",
	_escape  : function(v){
		return(("" + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "')); // "
	},
	prompt   : function (msg, title, def){
		return(this.eval('InputBox(' +
			'"' + this._escape(msg)         + '", ' +
			'"' + this._escape(title || '') + '", ' +
			'"' + this._escape(def   || '') + '")'));
	},
	alert    : function (msg){
		this.exec('MsgBox("' + this._escape(msg) + '")');
	},
	exec     : function (src){
		this._control.Language = this._lang;
		this._control.AddCode(src);
	},
	eval     : function (src){
		this._control.Language = this._lang;
		this._control.AddCode("Function Hoge() : Hoge = " + src + " : End Function");
		return(this._control.Run("Hoge"));
	}
};
String.prototype.indexChar = function (s, index){
	var lastindex = -1;
	for(var i = 0; i < s.length; i++){
		var v = this.indexOf(s.charAt(i), index);
		if(v >= 0 && (lastindex < 0 || v < lastindex)) {lastindex = v;}
	}
	return(lastindex);
};
String.prototype.repeat = function (n){
	var s = [];
	for(var i = 0; i < n; i++) {s.push(this+"");}
	return(s.join(""));
}

posX = Editor.ExpandParameter("$x")
posY = Editor.ExpandParameter("$y")
bNoSelected = false;
// 選択範囲がなければ全選択
if (Editor.IsTextSelected() == 0){
	bNoSelected = true;
	Editor.SelectAll();
}
//Editor.InsText(main());
main();
if (bNoSelected) Editor.Jump(posY,posX);

function main(){
	args = Editor.GetSelectedString(0);
	if(args.length == 0) {throw new Error("整形したい範囲を選択してください。");}
	var cstr = vbs.prompt("記号を入力してください。\nカンマと閉じ括弧は右にパディングされます。", "桁揃え記号",",=");
	if(!cstr || cstr.length == 0) {return;}
	
	var lines = args.split(/\n/);
	for(var i = 0; i < lines.length; i++) {lines[i] = Object(lines[i]); lines[i].lastindex = 0;}
	
	while(true){
		// 1. 区切り文字を含む行を列挙
		var islook = false;
		var xs     = [];
		for(var i = 0; i < lines.length; i++){
			if(lines[i].lastindex < 0) {continue;}
			lines[i].lastindex = lines[i].indexChar(cstr, lines[i].lastindex);
			if(lines[i].lastindex < 0) {continue;}
			
			lines[i].py = 0;
			for(var j = 0; j < lines[i].lastindex; j++) {lines[i].py += bytesize(lines[i], j);}
			lines[i].ch = lines[i].charAt(lines[i].lastindex);
			
			xs.push(i);
		}
		
		if(xs.length <= 1) {break;}
		
		// 2. 最左にある区切り文字を取得
		var spy = -1;
		var si  = 0;
		for(var i = 0; i < xs.length; i++){
			if(spy < 0 || lines[xs[i]].py < spy) {si = xs[i]; spy = lines[xs[i]].py;}
		}
		
		// 3. 2で取得した区切り文字と同じ文字で最右にあるものを取得
		var mpy = -1;
		for(var i = 0; i < xs.length; i++){
			if(lines[xs[i]].ch != lines[si].ch) {continue;}
			if(lines[xs[i]].py > mpy) {mpy = lines[xs[i]].py;}
		}
		
		// 4. 区切り文字の位置を3の最右にそろえる
		var ch      = lines[si].ch;
		var lenback = 1;
		if(ch.indexChar(",)]}")) {lenback = 0;}
		for(var i = 0; i < xs.length; i++){
			if(lines[xs[i]].ch == ch && lines[xs[i]].py <= mpy){
				var s = lines[xs[i]].substring(0, lines[xs[i]].lastindex + lenback) +
						" ".repeat(mpy - lines[xs[i]].py) +
						lines[xs[i]].substring(lines[xs[i]].lastindex + lenback);
				var l = lines[xs[i]].lastindex + mpy - lines[xs[i]].py + 1;
				
				lines[xs[i]] = Object(s);
				lines[xs[i]].lastindex = l;
			}
		}
	}
	Editor.InsText(lines.join("\n"));
//	return(lines.join("\n"));
}

function bytesize(s, index){
	var ch   = s.charCodeAt(index || 0);
	var high = ch >> 8;
	var low  = ch % (1 << 8);
	
	if(high == 0x00 || (high == 0xFF && (0x61 <= low && low <= 0x9F))) {return(1);}
	return(2);
}
