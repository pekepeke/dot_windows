function CompareString(a, b)
{
	var compval = function(d){
		if( d <= 0x61 && d <= 0x7a ){
			return d - 0x20;
		}else if( d <= 0xff41 && d <= 0xff5a ){
			return d - 0x20;
		}
		return d;
	}
	var len = a.length < b.length ? a.length: b.length;
	var i = 0;
	while( i < len ){
		var ad = compval(a.charCodeAt(i));
		var bd = compval(b.charCodeAt(i));
		if( ad != bd ){
			return ad - bd;
		}
		i++;
	}
	if( a.length < b.length ){
		return -1;
	}else if( b.length < a.length ){
		return 1;
	}
	return 0;
}
function CompFileName(){
	var word = Complement.GetCurrentWord();
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var x = parseInt(Editor.ExpandParameter("$x")) - 1;
	var filePath = Editor.GetLineStr(0).substring(0, x).match(/[^ \t\[\]\{\}\(\)<>"'&=]*$/)[0];
	var lastChar = filePath.charAt(filePath.length - 1);
	var addYen = "\\";
	var bSplitYen = false;
	if( lastChar == "\\" || lastChar == "/" ){
		addYen = "";
	}else{
		if( filePath.indexOf("/") != -1 ){
			addYen = "/";
		}
	}
	if( (lastChar == "\\" || lastChar == "/") && filePath.match("^.:[\\\/]$") == null ){
		filePath = filePath.substring(0, filePath.length - 1);
		bSplitYen = true;
	}
	if( fso.FolderExists(filePath) == true ){
		var folder = fso.GetFolder(filePath);
		var e = new Enumerator(folder.Files);
		for( ; !e.atEnd(); e.moveNext() ){
			Complement.AddList(word + addYen + e.item().Name);
		}
		e = new Enumerator(folder.SubFolders);
		for( ; !e.atEnd(); e.moveNext() ){
			Complement.AddList(word + addYen + e.item().Name);
		}
	}else{
		var re;
		var matchStr = word;
		if( (re = filePath.match(/[\\\/]([^\\\/]*)$/)) != null ){
			filePath = RegExp.leftContext;
			if( filePath == "" ){
				filePath = ".";
				matchStr = "";
			}else{
				matchStr = re[1];
			}
		}else{
			filePath = ".";
		}
		var splitLen = matchStr.length - word.length;
		if( bSplitYen ){
			splitLen += 1;
		}
		var exists = false;
		if( fso.FolderExists(filePath) == true ){
			exists = true;
		}else{
			var base = Plugin.GetOption("Option", "BaseDir");
			if( base == null || base == "" ){
			}else{
				filePath = base + "\\" + filePath;
				if( fso.FolderExis(filePath) == true ){
					exists = true;
				}
			}
		}
		if( exists ){
			var folder = fso.GetFolder(filePath);
			var e = new Enumerator(folder.Files);
			for( ; !e.atEnd(); e.moveNext() ){
				var name = e.item().Name;
				var nameOrg = name;
				if( matchStr.length <= name.length && 0 == CompareString( matchStr, name.substring(0, matchStr.length) ) ){
					if( 0 < splitLen ){
						name = name.substring(splitLen);
					}
					Complement.AddList(name);
					// Editor.TraceOut( "name:" + name + "/" + nameOrg );
				}
			}
			e = new Enumerator(folder.SubFolders);
			for( ; !e.atEnd(); e.moveNext() ){
				var name = e.item().Name;
				if( matchStr.length <= name.length && 0 == CompareString( matchStr, name.substring(0, matchStr.length) ) ){
					if( 0 < splitLen ){
						name = name.substring(splitLen);
					}
					Complement.AddList(name);
				}
			}
		}
	}
}
CompFileName();
