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

main();

function main(){
	var e = Editor;
	var NOFILE = "(–³‘è)";
	var keyword = vbs.prompt("", "Grep‚·‚é•¶Žš—ñ‚ÌŽw’è", e.ExpandParameter("$C"));
	var path = e.ExpandParameter("$F");
	var dir = path.replace(/[^\\]+$/,'');
	var file = path.replace(dir, '');
	if (path != NOFILE && keyword) {
		e.Grep( keyword, file, dir, 56);
	}
}
