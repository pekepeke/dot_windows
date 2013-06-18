(function(){
	var e = Editor;
	var url = e.GetSelectedString(0);
	if (url.length == 0) return;
	
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	
	var tempPath = getTempPath();//e.ExpandParameter("$S").replace(/[^\\]+$/,"httpsource.tmp");
	var http = typeof XMLHttpRequest == 'undefined' ? 
		new ActiveXObject('Microsoft.XMLHTTP')
		: new XMLHttpRequest();
	if (http){
		var uri = url;
		uri = uri.replace(/^h?ttp(s?):\/\//ig,"http$1://");
		if ( !uri.match(/^http:\/\//ig) ) uri = "http://" + uri;
		try {
			http.open("GET", uri, false);
			http.send(null);
		} catch (ex) {
			e.TraceOut(ex.message + "(" + ex.number + ")");
			return;
		}
		
		var html = http.responseText;
		var result = "";
		result += "------------------------------------------------------------\r\n";
		result += url + "\r\n";
		result += "------------------------------------------------------------\r\n";
		result += html;
		
		saveFile(tempPath, result);
		e.ExecCommand('type "'+tempPath+'"',0x01);
		//e.FileOpen(tempPath);
		deleteFile(tempPath);
	}
	// テンポラリファイルパス取得
	function getTempPath(){
		return fso.GetSpecialFolder(2) + "\\" + fso.getTempName();
	}

	 // ファイル保存
	function saveFile(path, text){
		stream = fso.CreateTextFile( path, true);
		stream.Write( text );
		stream.Close();
		return;
	}

	// ファイル削除
	function deleteFile(path) {
		if (fso.FileExists(path)) fso.DeleteFile(path, true);
	}
})();

