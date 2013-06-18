// sakura down ‹N“®
(function(){	//}}
var fso = new ActiveXObject("Scripting.FileSystemObject");
main();

function main(){
	var e = Editor;
	var editorpath = e.ExpandParameter("$S");
	var exepath = scanFolder(
			fso.GetFile( editorpath ).ParentFolder
			, "SakuraDown");
	if (exepath.length > 0) new ActiveXObject("WScript.Shell").Run(['"',exepath,'"'].join(""),1,false);
}

function scanFolder(path, searchString) {
	var regex = new RegExp(searchString,"i");
	var newfilepath = "";
	var newfilever = -1;
	
	if (fso.FolderExists(path)) {
		var folder = fso.GetFolder(path);
		
		for (var f = new Enumerator(folder.Files);!f.atEnd(); f.moveNext() ){
			filepath = new String(f.item());
			if (filepath.match( regex )) {
				var filever = getFileVersion(filepath);
				if (newfilever < filever){
					newfilepath = filepath;
					newfilever = filever;
				}
			}
		}
		
	}
	return newfilepath;
}

function getFileVersion( path ){
	return new Number("0"+path.replace(/[^0-9]+/g,""));
}
})();
