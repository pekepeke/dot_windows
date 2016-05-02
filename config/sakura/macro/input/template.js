(function() {
	var e = Editor;
	var MACRO_FOLDER = e.Expandparameter("$M").replace(/[^\\]+$/g, 'template');
	var SPC = "\t\t";

	var fso = new ActiveXObject("Scripting.FileSystemObject");

	function readFile(path) {
		var ForReading = 1;
		var text = '';
		if (!fso.FileExists(path)) return null;
		var stream = fso.OpenTextFile(path, ForReading);
		if (!stream.AtEndOfStream) text = stream.ReadAll();
		stream.Close();
		return text;
	}

	// main
	if (!fso.FolderExists(MACRO_FOLDER)) return;
	var files = [];
	var folder = fso.GetFolder(MACRO_FOLDER);
	var i = 0, j = 0;
	
//	try {
//		var popup = new ActiveXObject("EditorHelper.PopUp");
//	} catch (e) {
//		return;
//	}
	var popupMenuStrings = [];
	var prefix = "";
	for (var f = new Enumerator(folder.SubFolders) ; !f.atEnd(); f.moveNext() ,j++){
		popupMenuStrings.push("[S]" + fso.GetBaseName( f.item() ) +SPC+"(&"+(String.fromCharCode((j)%26+0x41))+")");
		files.push("");
		// popup.CreateSubMenu( fso.GetBaseName( f.item() ) +SPC+"(&"+(String.fromCharCode((j)%26+0x41))+")");
		var subfolder = fso.GetFolder( f.item() );
		prefix = "";
		for (var it = new Enumerator(subfolder.Files), k=0; !it.atEnd(); it.moveNext() ,k++, i++){
			files.push(it.item());
			// popup.AddSubMenu( fso.GetBaseName( it.item() ) +SPC+"(&"+(String.fromCharCode((k)%26+0x41))+")", i+1);
			if (subfolder.Files.Count <= k + 1) {
				prefix = "[E]";
			}
			popupMenuStrings.push(prefix + fso.GetBaseName( it.item() ) +SPC+"(&"+(String.fromCharCode((k)%26+0x41))+")");
		}
	}
	for (var it = new Enumerator(folder.Files) ;!it.atEnd(); it.moveNext() ,j++, i++){
		files.push(it.item());
		popupMenuStrings.push(fso.GetBaseName( it.item() ) +SPC+"(&"+(String.fromCharCode((j)%26+0x41))+")");
		// popup.AddMenu( fso.GetBaseName( it.item() ) +SPC+"(&"+(String.fromCharCode((j)%26+0x41))+")", i+1);
	}
	if (files.length <= 0) return;
	var idx = CreateMenu(1, popupMenuStrings.join(",")) - 1;
//	var idx = popup.TrackMenu() -1;
//	popup.DeleteMenu();
// ErrorMsg(idx);
	if (idx < 0) return;
	var macroPath = files[idx];
	if (macroPath.length <= 0) return;

	var retcode = {
		 '\\r\\n' : 1
		,'\\r'    : 3
		,'\\n'    : 2
	};
	var read = function(path) {
		var ForReading = 1;
		var line = '';
		var text = '';
		if (!fso.FileExists(path)) return '';
		var stream = fso.OpenTextFile(path, ForReading);
		if (!stream.AtEndOfStream) {
			line = stream.readLine()
			if (!stream.AtEndOfStream) text = stream.ReadAll();
		}
		stream.Close();
		return {head:line, body: text};
	}
	var ret = read(macroPath);
	if (!ret || !ret.body) return;
	var arr = ret.head.replace(/\r\n+/,'').split(",");
	var opener = {
		'sjis' : function() {e.FileReopenSJIS();} ,
		'shift_jis' : this.sjis,
		'jis' : function() {e.FileReopenJIS();} ,
		'euc' : function() {e.FileReopenEUC();} ,
		'euc-jp' : this.euc,
		'unicode' : function() {e.FileReopenUNICODE();} ,
		'utf8' : function() {e.FileReopenUTF8();} ,
		'utf-8' : this.utf8
	};
	var is_open = e.ExpandParameter('${U?true$:false$}');
	if (is_open == "false" && arr && arr.length == 2) {
		var func = opener[arr[0].toLowerCase()];
		if (typeof func == 'function') {
			func.call(null);
		}
		var rc = retcode[arr[1]];
		if (rc) e.ChgmodEOL(rc);
	}
	e.InsText(
		ret.body
			.replace(/\r\n/g,'\n')
			.replace(/\r/g,'\n')
			.replace(/\n/g, Array("\r\n","\r","\n")[e.GetLineCode()])
	);
})();
