(function(){
	var RETRY_MAX = 10;
	var SLEEP_SEC = 1;
	var e = Editor;
	
	var url = e.GetSelectedString(0);
	if (url.length == 0) return;
	
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var text = "";
	url = url.replace(/^h?ttp(s?):\/\//ig,"http$1://");
	if (!url.match(/^http:\/\//ig) ) {
		text = url;
		url = "about:blank";
	}
	
	var tempPath = getTempPath();//e.ExpandParameter("$S").replace(/[^\\]+$/,"httpsource.tmp");
	try {
		var ie = new ActiveXObject("InternetExplorer.Application");
		
		ie.Navigate(url);
		
		if (text.length > 0) {
			ie.document.write(text);
		} else {
			var retry = 0;
			while (ie.busy) {
				if (retry > RETRY_MAX) throw new Error(-1,"リトライ回数を超えたので終了しました。");
				sleep(SLEEP_SEC);
				retry++;
			}
			retry = 0;
			while (ie.readyState != 4) {
				if (retry > RETRY_MAX) throw new Error(-1,"リトライ回数を超えたので終了しました。");
				sleep(SLEEP_SEC);
				retry++;
			}
		}
		saveFile(tempPath, ie.document.body.innerText);
		e.ExecCommand('type "'+tempPath+'"',0x01);
		//e.FileOpen(tempPath);
		deleteFile(tempPath);
	} catch (ex) {
		e.TraceOut("Error:"+ex.message + "(" + ex.number + ")");
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

	function sleep(sec) {
		var self = arguments.callee;
		if (self.sh == null) self.sh = new ActiveXObject("WSCript.Shell");
		self.sh.Run("ping localhost -n " + parseInt(sec) , 0, true);
	}
})();

