// 指定したフォルダ内の JSマクロランチャー
(function(){//})
	var e = Editor;
	var MACRO_FOLDER = Editor.Expandparameter("$M").replace(/[^\\]+$/g, 'language');
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
	
	try {
		var popup = new ActiveXObject("EditorHelper.PopUp");
	} catch (e) {
		return;
	}
	for (var f = new Enumerator(folder.SubFolders) ;!f.atEnd(); f.moveNext() ,j++){
		popup.CreateSubMenu( fso.GetBaseName( f.item() ) +SPC+"(&"+(String.fromCharCode((j)%26+0x41))+")");
		var subfolder = fso.GetFolder( f.item() );
		for (var it = new Enumerator(subfolder.Files), k=0;!it.atEnd(); it.moveNext() ,k++, i++){
			files.push(it.item());
			popup.AddSubMenu( fso.GetBaseName( it.item() ) +SPC+"(&"+(String.fromCharCode((k)%26+0x41))+")", i+1);
		}
	}
	for (var it = new Enumerator(folder.Files) ;!it.atEnd(); it.moveNext() ,j++, i++){
		files.push(it.item());
		popup.AddMenu( fso.GetBaseName( it.item() ) +SPC+"(&"+(String.fromCharCode((j)%26+0x41))+")", i+1);
	}
	if (files.length <= 0) return;
	
	var idx = popup.TrackMenu() -1;
	popup.DeleteMenu();
	
	if (idx < 0) return;
	var macroPath = files[idx];
	
	var text = readFile(macroPath);
	if (!text) return;
	eval(text);
})();
