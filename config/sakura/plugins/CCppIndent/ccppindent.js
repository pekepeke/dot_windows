// Sakura-Editor用プラグイン
// {}オートインデント ver 0.1
// copyright 2010 Moca
CppIndent();

function CppIndent()
{
	var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
	if(1 != nCurColumn ){
		return;
	}

	var nCurLine   = parseInt(Editor.ExpandParameter("$y"));
	var nTargetLine = (1 == nCurColumn ? nCurLine - 1: nCurLine);
	var strLine = Editor.GetLineStr( nTargetLine );
	var nIndentDiff = GetIndentDiff(strLine);

	var strLineIndent = strLine.match(/^[ \t　]*/)[0];

	//タブ幅
	var nTabWidth = Editor.ChangeTabWidth( 0 );
	if( nTabWidth <= 0 ){
		nTabWidth = 1;
	}
	var Opt_IndentMode = Plugin.GetOption("Option", "IndentMode");
	var Opt_IndentWidth = Plugin.GetOption("Option", "IndentWidth");
	var nIndentMode  = (Opt_IndentMode == ""? 0 : parseInt(Opt_IndentMode));
	var nIndentWidth = parseInt(Opt_IndentMode);
	if( nIndentWidth <= 0 ){
		Plugin.SetOption("Option", "IndentWidth", nTabWidth);
		nIndentWidth = nTabWidth;
	}
	// 未設定は""で0
	var nIndentPrevData = (Plugin.GetOption("Option", "IndentPrevData") == "1" ? 1 : 0);

	// 現在のキーを取得する手段がないので、
	// カーソル位置が1 Offsetのときにインデント発動
	var i;
	var strIns = "";

	if( 1 == nCurColumn ){
		// インデント
		if( 0 == nIndentMode ){
		    // タブインデント
			if( 1 <= nIndentDiff ){
				strIns = "\t";
			}
			if( 1 == nIndentPrevData ){
				strLineIndent = Tab2Sp(strLineIndent, nTabWidth);
				strLineIndent = (strLineIndent + strIns).replace(new RegExp(Tab2Sp("\t", nTabWidth), "g"), "\t");
				Editor.InsText( strLineIndent );
			}else{
				Editor.InsText( strLineIndent + strIns );
			}
		}else if( 1 == nIndentMode ){
			// スペースインデント
			if( 1 <= nIndentDiff ){
				for( i = 0; i < nIndentWidth; i++ ){
					strIns += " ";
				}
			}
			if( 1 == nIndentPrevData ){
				strLineIndent = Tab2Sp(strLineIndent, nTabWidth);
				Editor.InsText( strLineIndent + strIns );
			}else{
				Editor.InsText( strLineIndent + strIns );
			}
		}else{
			// Tab+スペースインデント
			if( 1 <= nIndentDiff ){
				for( i = 0; i < nIndentWidth; i++ ){
					strIns += " ";
				}
			}
			strLineIndent = Tab2Sp(strLineIndent, nTabWidth);
			strLineIndent = (strLineIndent + strIns).replace(new RegExp(Tab2Sp("\t", nTabWidth), "g"), "\t");
			Editor.InsText( strLineIndent );
		}
	}else{
		/*
		// 逆インデント
		var nNewWidth = Tab2Sp(strLineIndent, nTabWidth).length - nIndentWidth;
		var newIndent = strLineIndent;
		for( i = strLineIndent.length; 0 <= i; --i ){
			newIndent = strLineIndent.substring(0,i);
			if( Tab2Sp(newIndent, nTabWidth).length == nNewWidth){
				break;
			}
		}
		// ReplaceLine( strLine.replace(strLineIndent,newIndent) );
		Editor.SelectLine(0);
		Editor.InsText( strLine.replace( strLineIndent, newIndent ) );
		*/
	}
}

function Tab2Sp(str, width)
{
	var ret = "";
	var last = 0;
	var tabadd = 0;
	for( var i = 0; i < str.length; i++ ){
		if( 0x09 == str.charCodeAt(i) ){
			ret += str.substring(last, i);
			last = i;
			var add = width - ((i + tabadd) % width);
			tabadd += add - 1;
			for( var t = 0; t < add; t++ ){
				ret += " ";
			}
		}else if( 0x3000 == str.charCodeAt(i) ){
			ret += str.substring(last, i);
			last = i;
			tabadd++;
			ret += " ";
		}
	}
	ret += str.substring(last, i);
	return ret;
}

function ReplaceLine(str)
{
	var lineCode = Editor.GetLineCode();
	if(0 == lineCode){
		// CRLF
		str = str.replace(/\n/g, "\r\n");
	}else if(1 == lineCode){
		// CR
		str = str.replace(/\n/g, "\r");
	}
	Editor.SelectLine(0);
	Editor.InsText( str );
}

// 文法上の{}を拾うための行内解析器
// return インデント増減幅
function GetIndentDiff(strLine)
{
	var rePerseItems = /[\/\'\"\{\}]|(@")/; // ' //"
	var nLinePos = 0;
	var strLineSub = strLine;
	var nLineEnd = strLine.length;
	var nCharCode;
	var nlastBracket = 0;

	var nIndent = 0;

	for( ; nLinePos < nLineEnd; ++nLinePos ){
		if(0 < nLinePos){
			strLineSub = strLine.substr(nLinePos);
		}
		retRe = strLineSub.search(rePerseItems);
		if(-1 == retRe){
			break; // 次の行へ
		}
		nLinePos += retRe;
		
		nCharCode = strLine.charCodeAt(nLinePos);
		// '//'
		if( 0x2f == nCharCode ){
			if( 0x2f == strLine.charCodeAt(nLinePos + 1) ){
				break;
			}
			// /*
			if( 0x2a == strLine.charCodeAt(nLinePos + 1) ){
				nPos = strLine.substr(nLinePos + 2).indexOf("*/");
				if( -1 == nPos){
					break;
				}
				nLinePos += nPos + 4;
				continue;
			}
			//ココにきたら 除算(/,/=)か正規表現(/xxxx/ig)
			// 演算子は(単項-+以外)連続しないので、演算子直後の/は正規表現
			var strRegexLeft = strLineSub.substr(0,nLinePos + 1 - (nLineEnd - strLineSub.length));
			// 直前は演算子等 または何もない 「a + /test/.match(str)[0]」とかもあるので...
			// {}[(,:;=<>!+-*/%&^|?    多分違う演算子 .)]'"
			if( (-1 != strRegexLeft.search(/[\{\}\[\(\,\:;=<>!\+\-\*\/%\&\^\|\?][ \t　\xa0]*\/$/) // \]\)
					|| -1 != strRegexLeft.search(/^[ \t　\xa0]*\/$/))){
				if(null != (retRe = strLine.substr(nLinePos).match(/^\/(?:\\.|[^\/\r\n])+\/[gimy]{0,4}/)) ){
					var strRegexRight = strLine.substr(nLinePos + retRe[0].length);
					// 右側の演算子を確認  対括弧強調つじつまあわせ→ \( \[
					if( -1 != strRegexRight.search(/^[ \t　\xa0]*([\)\.\]\r\n\{\}\,\:;=<>!\+\-\*\/%\&\^\|\?]|\/\/|\/\*)/) ){
						nLinePos += retRe[0].length - 1;
					} // else 文法 error
				}
			}
		}else
		// '
		if( 0x27 == nCharCode ){
			nLinePos++;
			for(; nLinePos < nLineEnd; ++nLinePos){
				// \
				if( 0x5c == strLine.charCodeAt(nLinePos) ){
					++nLinePos;
					if( nLinePos < nLineEnd && 
							0x27 == strLine.charCodeAt(nLinePos) ){
						break; // '終わり
					}
				}else if( 0x27 == strLine.charCodeAt(nLinePos) ){
					break; // '終わり
				}
			}
			continue;
		}else
		// "
		if( 0x22 == nCharCode ){
			nLinePos++;
			for(; nLinePos < nLineEnd; ++nLinePos){
				// \
				if( 0x5c == strLine.charCodeAt(nLinePos) ){
					++nLinePos;
					if( nLinePos < nLineEnd && 
							0x22 == strLine.charCodeAt(nLinePos) ){
						break; // "終わり
					}
				}else if( 0x22 == strLine.charCodeAt(nLinePos) ){
					break;  // "終わり
				}
			}
			continue;
		}else
		// @"
		if(0x40 == nCharCode){
			nLinePos++; // "のぶん
			nLinePos++;
			for(; nLinePos < nLineEnd; ++nLinePos){
				// "
				if( 0x22 == strLine.charCodeAt(nLinePos) ){
					break;  // "終わり
				}
			}
		}else
		// {
		if(0x7b == nCharCode){
			nIndent++;
			nlastBracket = 1;
		}else
		// }
		if(0x7d == nCharCode){
			nIndent--;
			nlastBracket = 2;
		}
	}
	// {
	// "} else {"系統   // }
	if( nlastBracket == 1 && 0 == nIndent ){
		nIndent++;
	}
	return nIndent;
}
