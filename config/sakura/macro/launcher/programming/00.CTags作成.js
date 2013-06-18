// ctags ファイル作成
(function(){
	function prompt(msg, title, def){
		var ctl = arguments.callee.control ? arguments.callee.control: new ActiveXObject("ScriptControl");
		ctl.Language = "VBScript";
		var src = 'InputBox("' + _vbescape(msg) + '", ' +
			'"' + _vbescape( title || '') + '", ' +
			'"' + _vbescape( def || '') + '")';
		ctl.AddCode("Function Hoge() : Hoge = " + src + " : End Function");
		return ctl.Run("Hoge");
	}

	function _vbescape(v) {
		return ("" + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "'); // "
	}
	
	var e = Editor;
	var ctags = e.ExpandParameter("$S").replace(/[^\\]+$/,'ctags.exe');
	var title = "CTAGファイルを作成するフォルダを入力して下さい";
	var path = prompt(title, title, e.ExpandParameter("$F").replace(/[^\\]+$/,'') );
	if (!path) return;
	
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	if (fso.FolderExists( path )){
		var sh = new ActiveXObject("WScript.Shell");
		sh.CurrentDirectory = path;
		sh.Run( ['"', ctags, '" --excmd=n -R "', path,'"'].join("") , 7, false);
	}
})();
