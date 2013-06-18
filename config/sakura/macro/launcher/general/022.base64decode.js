(function(){
	var e = Editor;
	var file = e.ExpandParameter('$F');
	var saveFile = file+'.bin';

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
		alert( saveFile + 'Ç™ä˘Ç…ë∂ç›ÇµÇƒÇ¢Ç‹Ç∑ÅB');
		return;
	}
	
	try {
		var adTypeBinary = 1;
		var adSaveCreateNotExist = 1;
		var adSaveCreateOverWrite = 2;

		var dom = new ActiveXObject('Microsoft.XMLDOM');
		var tmp = dom.createElement('tmp');
		tmp.dataType = 'bin.base64';
		tmp.text = fso.OpenTextFile(file).ReadAll();
		e.TraceOut(tmp.text);
		var bin = tmp.nodeTypedValue;

		var stream = new ActiveXObject('ADODB.Stream');
		stream.type = adTypeBinary;
		stream.open();
		stream.write(bin);
		stream.saveToFile(saveFile, adSaveCreateNotExist);
		stream.close();
	} catch (ex) {
		alert(ex);
		return;
	}
})();
