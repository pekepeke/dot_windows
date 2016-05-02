// 指定したフォルダ内の JSマクロランチャー
(function(){//})
	var e = Editor;
	var MACRO_FOLDER = e.Expandparameter("$M").replace(/[^\\]+$/g, 'general');
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
	
	var text = readFile(macroPath);
	if (!text) return;
	eval(text);

})();
