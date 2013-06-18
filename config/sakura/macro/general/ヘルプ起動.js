// ÉtÉ@ÉCÉãì«Ç›çûÇ›
(function(){	//}}

var fso = new ActiveXObject("Scripting.FileSystemObject");
var add_help_defs = [
//	 ['title', 'path']
//	,['', '']
];


showPopUp();

function readFile(path) {
	var ForReading = 1;
	var text = '';
	if (!fso.FileExists(path)) return null;
	var stream = fso.OpenTextFile(path, ForReading);
	if (!stream.AtEndOfStream) text = stream.ReadAll();
	stream.Close();
	return text;
}

function showPopUp(){
	var path = Editor.ExpandParameter("$I");
	var text = readFile(path);
	if (!text) return;
	var regexps = {
		name : /^szTypeName=[^\r\n]*/gm,
		help : /^szExtHtmlHelp=[^\r\n]*/gm,
		nameTitle : /^szTypeName=/,
		helpTitle : /^szExtHtmlHelp=/
	};
	
	var names = new Array("ã§í ").concat(text.match(regexps.name));
	var helps = text.match(regexps.help);
	
	if (add_help_defs) {
		var nlist = new Array();
		var hlist = new Array();
		for (var i=0; i<add_help_defs.length; i++){
			nlist.push(add_help_defs[i][0]);
			hlist.push(add_help_defs[i][1]);
		}
		names = names.concat(nlist);
		helps = helps.concat(hlist);
	}
	
	if (!names || !helps) return;
	if (names.length != helps.length) return;
	
	try {
		var popup = new ActiveXObject("EditorHelper.PopUp");
	} catch (e) {
		var msg = ""
		if (e.description) msg= e.name + ":" + e.description + "(" + e.number + ")\n" + e.message;
		else msg = e;
		return;
	}
	var j=0;
	for (var i=0; i<names.length ; i++){
		var name = names[i].replace(regexps.nameTitle, '');
		var help = helps[i].replace(regexps.helpTitle, '');
		if (help.length <= 0) continue;
		
//		popup.AddMenu(name +" - "+fso.GetBaseName(help)+"(&"+(j+1<10?j+1:String.fromCharCode((j-9)%26+0x41))+")", i+1);
		popup.AddMenu(name +" - "+fso.GetBaseName(help)+"(&"+(String.fromCharCode(j%26+0x41))+")", i+1);
		j++;
	}
	var idx = popup.TrackMenu() - 1;
	popup.DeleteMenu();
	if (idx < 0) return;
	var help_path = helps[idx].replace(regexps.helpTitle, '');
	if (help_path.match(/^\./)) {
		help_path = Editor.ExpandParameter("$S").replace(/[^/\\]+$/,'') + help_path;
	}
	if (help_path) new ActiveXObject("WScript.Shell").Run( '"'+ help_path +'"' );
}

})();