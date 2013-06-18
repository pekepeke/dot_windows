(function() {
	var e = Editor;
	//var MACRO_FOLDER = e.Expandparameter('$M').replace(/[^\\]+$/g, 'snnipet');
	var MACRO_FOLDER = 'C:\\Personal\\Home\\Library\\scrapcode';
	var SPC = '\t\t';

	var fso = new ActiveXObject('Scripting.FileSystemObject');
	if (!fso.FolderExists(MACRO_FOLDER)) return;
	var files = [];
	var folder = fso.GetFolder(MACRO_FOLDER);
	var i = 0, j = 0;
	
	try {
		var popup = new ActiveXObject('EditorHelper.PopUp');
	} catch (e) {
		return;
	}
	for (var f = new Enumerator(folder.SubFolders) ;!f.atEnd(); f.moveNext() ,j++){
		var item = f.item()
		var nm = fso.GetBaseName(item);
		var idx = nm.toLowerCase().charCodeAt(0);
		idx = idx >= 0x61 && idx <= 0x7a ? idx : (j)%26+0x41;
		popup.CreateSubMenu( nm +SPC+'(&'+(String.fromCharCode(idx))+')');
		var subfolder = fso.GetFolder( item );
		for (var it = new Enumerator(subfolder.Files), k=0;!it.atEnd(); it.moveNext() ,k++, i++){
			var _item = it.item();
			var _name = fso.GetBaseName(_item);
			var _idx = _name.toLowerCase().charCodeAt(0);
			_idx = _idx >= 0x61 && _idx <= 0x7a ? _idx : (k)%26+0x41;
			files.push(_item);
			popup.AddSubMenu( _name +SPC+'(&'+(String.fromCharCode(_idx))+')', i+1);
		}
	}
	for (var it = new Enumerator(folder.Files) ;!it.atEnd(); it.moveNext() ,j++, i++){
		var item = it.item();
		var nm = fso.GetBaseName(item);
		var idx = nm.toLowerCase().charCodeAt(0);
		idx = idx >= 0x61 && idx <= 0x7a ? idx : (j)%26+0x41;
		files.push(item);
		popup.AddMenu( nm +SPC+'(&'+(String.fromCharCode(idx))+')', i+1);
	}
	if (files.length <= 0) return;
	
	var idx = popup.TrackMenu() -1;
	popup.DeleteMenu();
	
	if (idx < 0) return;
	var filePath = files[idx];

	var retcode = {
		 '\\r\\n' : 1
		,'\\r'    : 4
		,'\\n'    : 3
	};
	var read = function(path) {
		var ForReading = 1;
		var line = '';
		var text = '';
		if (!fso.FileExists(path)) return '';
		var stream = fso.OpenTextFile(path, ForReading);
		if (!stream.AtEndOfStream) text = stream.ReadAll();
		stream.Close();
		return text;
	}
	var text = read(filePath);
	if (!text) return;
	e.InsText(
		text.replace(/\r\n/g,'\n')
			.replace(/\r/g,'\n')
			.replace(/\n/g, Array('\r\n','\r','\n')[e.GetLineCode()])
	);
})();
