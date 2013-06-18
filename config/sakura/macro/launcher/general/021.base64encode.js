(function(){
	var e = Editor;
	var file = e.ExpandParameter('$F');
	var saveFile = file+'.txt';

	var fso = new ActiveXObject('Scripting.FileSystemObject');
	if (!fso.FileExists(file)) return;
	
	var alert = (function(){
		var _escape = function(v){ return(('' + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "')); }; // "
		var ctl = new ActiveXObject('ScriptControl');
		ctl.Language = 'VBScript';
		return function(msg){ 
			ctl.AddCode('MsgBox("' + _escape(msg) + '")'); 
		};
	})();
	
	if (fso.FileExists(saveFile)) {
		alert( saveFile + '‚ªŠù‚É‘¶İ‚µ‚Ä‚¢‚Ü‚·B\nˆ—‚ğ’†’f‚µ‚Ü‚µ‚½B');
		return;
	}
	
	try {
		var adTypeBinary = 1;
		var adSaveCreateNotExist = 1;
		var adSaveCreateOverWrite = 2;

		var stream = new ActiveXObject('ADODB.Stream');
		stream.type = adTypeBinary;
		stream.open();
		stream.loadFromFile(file);
		stream.position = 0;
		var bin = stream.read();
		stream.close();
		
		var dom = new ActiveXObject('Microsoft.XMLDOM');
		var tmp = dom.createElement('tmp');
		tmp.dataType = 'bin.base64';
		tmp.nodeTypedValue = bin;
		
		fso.CreateTextFile( saveFile, false).Write(tmp.text.replace(/\n/g,'\r\n'));

	} catch (ex) {
		alert(ex);
		return;
	}
})();
