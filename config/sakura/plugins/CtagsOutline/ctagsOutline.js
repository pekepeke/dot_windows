/*
	Ctagsによるアウトライン解析 for サクラエディタ
	Copyright(C) 2003-2013 Moca
*/
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

function OpenTagsFile()
{
	var fileName = Editor.GetFileName();
	if( fileName == "" ){
		return null;
	}
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var tagfile = "tags";
	var upFolders = 0;
	var i = 0;
	fileName.replace(/\\/g, function(s){ upFolders++; return s; });
	do{
		var file = null;
		try{
			file = fso.OpenTextFile(tagfile, 1, false);
			return {file:file, nDepth:i};
		}catch(e){
			if( file != null ){
				file.Close();
			}
		}
		tagfile = "..\\" + tagfile;
		upFolders;
		i++;
	} while( i < upFolders );
	return null;
}

/*
	nDepth分のフォルダ付きファイル名を返す。
	path = C:\abc\def\ghi.txt で nDepth = 1なら、def\ghi.txt
*/
function GetFileNameFromPath( path, nDepth )
{
	var nCount = 0;
	var p;
	for( p = path.length - 1; 0 <= p ; p-- ){
		if( path.charAt(p) == '\\' || path.charAt(p) == '/' ){
			if( nCount == nDepth ){
				return path.substr(p+1);
			}
			nCount++;
		}
	}
	return path;
}

function OutLineExec()
{
	Outline.SetTitle( "キーワード リスト(Ctags)" );
	Outline.SetListType(300); // 100=ツリー表示, 300=リスト表示

	var tmp =  OpenTagsFile();
	if( tmp == null ){
		// Editor.InfoMsg( "tagsファイルが見つかりません" );
		Outline.AddFuncInfo(1, 1, "エラー: tagsファイルが見つかりません", 0);
		return;
	}
	var file = tmp.file;
	var nDepth = tmp.nDepth;
	var opt = {
		bIgnoreDirname: false,
		szIgnoreTypes: ""
	};
	{
		var o = Plugin.GetOption("Option", "bIgnoreDirname");
		if( o == "" ){
			o = 0;
			Plugin.SetOption("Option", "bIgnoreDirname", o);
		}
		opt.bIgnoreDirname = parseInt(o);
		o = Plugin.GetOption("Option", "szIgnoreTypes");
		if( o == "" ){
			o = "demp";
			Plugin.SetOption("Option", "szIgnoreTypes", o);
		}
		opt.szIgnoreTypes = o;
	}
	var bSort = false;
	if( 0 <= Editor.CompareVersion("2.0.8.1", Editor.ExpandParameter("$V")) ){
		// 2.0.8.1以前は行桁順ソート済みでないと選択がおかしくなる
		bSort = true;
	}
	var fileName = GetFileNameFromPath( Editor.GetFileName(), (opt.bIgnoreDirname ? 0 : nDepth) );
	var editFileName = Editor.GetFileName();
	var szLine;

	var szFile;
	var szKeyWord;
	var szType;
	var szOption;
	var nLineNum;
	var nCount = 0;
	var aOutLineData = [];
	var dbgMsg = "";

	do {
		szLine = file.ReadLine();
		if( szLine.charAt(0) == '!' ){
			continue;
		}
		if( /([^\t\r\n]+)\t([^\t\r\n]+)\t(\d+);"\t([^\t\r\n]*)\t?([^\t\r\n]*)/.test(szLine) ){
			var re = szLine.match(/([^\t\r\n]+)\t([^\t\r\n]+)\t(\d+);"\t([^\t\r\n]*)\t?([^\t\r\n]*)/);
			szKeyWord = re[1];
			szFile = re[2];
			nLineNum = parseInt(re[3]);
			szType = re[4];
			szOption = re[5];
		}else{
			continue;
		}
		var fileMatch = false;

		var keyFile = szFile;
		if( opt.bIgnoreDirname ){
			keyFile = GetFileNameFromPath( szFile, 0 );
		}else{
			if( szFile.substr(0,2) == "./" ){
				keyFile = szFile.substr(2);
			}
			if( 0 == CompareString( editFileName, keyFile ) ){
				fileMatch = true;
			}
		}
		if( !fileMatch && 0 == CompareString( fileName, keyFile ) ){
			fileMatch = true;
		}
		if( fileMatch ){
			if( szType.length == 1 && -1 != opt.szIgnoreTypes.indexOf(szType.charAt(0)) ){
				// 無視するタイプなので追加しない
			}else{
				nCount++;
				if( bSort ){
					aOutLineData.push({nLineNum:nLineNum, szKeyWord:szKeyWord, nCount:nCount});
				}else{
					Outline.AddFuncInfo(nLineNum, 1, szKeyWord, 0);
				}
			}
		}
	} while( file.AtEndOfStream == false );
	file.Close();
	file = null;
	if( bSort ){
		var sort_func = function(a, b){
			var n = a.nLineNum - b.nLineNum;
			if( n != 0 ){
				return n;
			}
			return a.nCount - b.nCount;
		};
		aOutLineData.sort(sort_func);
		for(var i = 0; i < nCount; i++){
			Outline.AddFuncInfo(aOutLineData[i].nLineNum, 1, aOutLineData[i].szKeyWord, 0);
		}
	}
	return;
}

OutLineExec();
