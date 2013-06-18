
/*!
	Php関数一覧アウトライン解析 for サクラエディタ プラグイン
	Copyright(C) 2010-2013 Moca All Rights Reserved.
	@ver 0.1
	
	0.1 :初版
*/
var g_opt = {};
// プラグ設定ファイルを読み込む(ブラウザ上テストでOFFにする用)
var g_bLoadPluginOption = true;
/*
	@param nDepth     ルートの階層(0で最上)
	@param first_line 解析対象の先頭行(1開始)
	@param last_line  解析対象の最終行(1開始)
	@param begin_colm 先頭行の解析開始桁位置(0開始)
	@param end_colm   最終行の解析終了桁位置(0開始) + 1
	@note
		コメント,文字列,正規表現対応,Tree表示
	@return boolean 常にtrueをかえす
*/
function php_OutlineExec(nDepth, first_line, last_line, begin_colm, end_colm)
{

	var cstrSp = " ";
	var reFunction = /\bfunction\b/;
	var reClassTrait = /\bclass|trait\b/;
	var rePerseItems = /[\/\'\"\{\}#]|(function\b)|(class\b)|(trait\b)|\?>|<<<|<script language="php">/; // ' //"

	var nLineNum;
	var strLine;
	var nLineEnd;

	var nMode = 2; // 0:普通 1:複数行コメント 2:デフォルト 3:heredoc 4:' 5:" 6:</script>
	var nModePrev = 0;
	var nNest = []; // 関数ごとの{}のネストレベル
	var classNameNest = []; // 
	var nFuncNest = 0; // 今の関数になってから追加のネストレベル
	var bAddFunc = false; // 関数追加直後,{未満   //対カッコ対策:}

	var strLineSub;
	var nCharCode;
	var nLinePos;
	var strAddTitle;
	var nPos = -1;
	var retRe = null;
	var heredoc = "";

	for( nLineNum = first_line; nLineNum <= last_line; ++nLineNum ){
		strLine = Editor.GetLineStr( nLineNum );
		if(strLine == null){
			return false;
		}

		nLinePos = 0;
		nLineEnd = strLine.length;
		if(nLineNum == last_line){
			strLine = strLine.substr(0,end_colm);
		}
		if(nMode == 1){
			if(-1 != (nPos = strLine.indexOf("*/"))){
				nMode = nModePrev;
				nLinePos = nPos + 2;
			}else{
				continue; // 次の行へ
			}
		}else
		if(nMode == 3){
			nCharCode = strLine.charCodeAt(heredoc.length);
			if(0 == (nPos = strLine.indexOf(heredoc)) && (0x0a == nCharCode || 0x0d == nCharCode || 0x3b == nCharCode)){
				nMode = nModePrev;
				nLinePos = nPos + heredoc.length + 1;
			}else{
				continue; // 次の行へ
			}
		}
		// ありがたいことに1行目は nMode == 1でないので後ろにおける
		if(nLineNum == first_line && 0 < begin_colm ){
			nLinePos = begin_colm - 1;
		}

		strLineSub = strLine;
		for( ; nLinePos < nLineEnd; ++nLinePos ){
			if(nMode == 2){
				if(0 < nLinePos){
					strLineSub = strLine.substr(nLinePos);
				}
				nCharCode = -1;
				var nTagLen = 0;
				if(-1 != (nPos = strLineSub.indexOf("<?php"))){
					nCharCode = strLineSub.charCodeAt(nPos + 5);
					nTagLen = 5;
				}else if(-1 != (nPos = strLineSub.indexOf("<?="))){
					nCharCode = strLineSub.charCodeAt(nPos + 3);
					nTagLen = 3;
				}
				if( 0x09 == nCharCode || 0x20 == nCharCode || 0x0a == nCharCode || 0x0d == nCharCode ){
					nModePrev = nMode = 0;
					nLinePos += nPos + nTagLen;
				}else if(-1 != (nPos = strLineSub.indexOf("<script language=\"php\">"))){
					nModePrev = nMode = 6;
					nLinePos += nPos + 23;
				}else{
					break;
				}
			}else
			if(nMode == 4){
				for(; nLinePos < nLineEnd; ++nLinePos){
					// \
					if( 0x5c == strLine.charCodeAt(nLinePos) ){
						if( nLinePos < nLineEnd ){
							++nLinePos;
						}
					}else if( 0x27 == strLine.charCodeAt(nLinePos) ){
						++nLinePos;
						nMode = nModePrev;
						break; // '終わり
					}
				}
				if( nLineEnd <= nLinePos ){
					// 行末まで文字列内だった
					break;
				}
			}else
			if(nMode == 5){
				for(; nLinePos < nLineEnd; ++nLinePos){
					// \
					if( 0x5c == strLine.charCodeAt(nLinePos) ){
						if( nLinePos < nLineEnd ){
							++nLinePos;
						}
					}else if( 0x22 == strLine.charCodeAt(nLinePos) ){
						++nLinePos;
						nMode = nModePrev;
						break;  // "終わり
					}
				}
				if( nLineEnd <= nLinePos ){
					// 行末まで文字列内だった
					break;
				}
			}else{
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
						if( nModePrev == 0 ){
							nPos = strLine.substr(nLinePos + 2).indexOf("?>");
							if( nPos == -1 ){
								break;
							}else{
								nMode = 2;
								nLinePos += nPos + 2;
							}
						}else{
							break;
						}
					}
					// /*
					if( 0x2a == strLine.charCodeAt(nLinePos + 1) ){
						//行内はここで検索
						nPos = strLine.substr(nLinePos + 2).indexOf("*/");
						if( -1 == nPos){
							nMode = 1;// コメントモード
							break; // 次の行へ
						}
						nLinePos += nPos + 4;
						continue;
					}
				}else
				// #
				if( 0x23 == nCharCode ){
					if( nModePrev == 0 ){
						nPos = strLine.substr(nLinePos + 1).indexOf("?>");
						if( nPos == -1 ){
							break;
						}else{
							nMode = 2;
							nLinePos += nPos + 1;
						}
					}else{
						break;
					}
				}else
				// '
				if( 0x27 == nCharCode ){
					nMode = 4;
					continue;
				}else
				// "
				if(0x22 == nCharCode){
					nMode = 5;
					continue;
				}else
				// function の f
				if(0x66 == nCharCode){
					if(0 < nLinePos){
						nPos = nLinePos -1; // 直前の文字を含めてtestしたい
					}else{
						nPos = nLinePos;
					}
					// " function " を比較。 単語認識で前後1文字ずつ必要
					if(reFunction.test(strLine.substr(nPos, 10))){
						strAddTitle = strLine.substr(nLinePos);
						if( /([\w\u007f-\ufffe]+)(\s*)\(/.test(strAddTitle) ){
							strAddTitle = strLine.substr(nLinePos).match(/([\w\u007f-\ufffe]+)(\s*)\(/)[1];
							if( g_opt.vs == 0 ){
								AddFuncInfoBoth( nLineNum, nLinePos, strAddTitle, nNest.length + nDepth );
							}else{
								var s = strAddTitle;
								if( 0 < classNameNest.length && "" != classNameNest[classNameNest.length - 1] ){
									s = classNameNest[classNameNest.length - 1] + "::" + strAddTitle;
								}
								if( g_opt.vs == 1 ){
									AddFuncInfoBoth( nLineNum, nLinePos, s, nNest.length + nDepth );
								}else{
									AddFuncInfoBoth( nLineNum, nLinePos, s, nNest.length + nDepth, 2 );
								}
							}
							classNameNest.push("");
							strAddTitle = null;
							bAddFunc = true;
						//}else
						//if( /function(\s*)\(/.test(strAddTitle) ){
						//	strAddTitle = "無名";
						//}else{
						//	strAddTitle = "不明";
						}
						nLinePos += 7;
						continue;
					}
				}else
				// class
				if(0x63 == nCharCode || 0x74 == nCharCode){
					if(0 < nLinePos){
						nPos = nLinePos -1; // 直前の文字を含めてtestしたい
					}else{
						nPos = nLinePos;
					}
					// " class " を比較。 単語認識で前後1文字ずつ必要 $classはclass定義じゃない
					if(reClassTrait.test(strLine.substr(nPos, 7)) && 0x24 != strLine.charCodeAt(nPos)){
						strAddTitle = strLine.substr(nLinePos, 200);
						var addName;
						var bTrait = false;
						if( /^class(\s+)([\w\u007f-\ufffe]+)/.test(strAddTitle) ){
							strAddTitle = strAddTitle.match(/^class(\s+)([\w\u007f-\ufffe]+)/)[2];
							addName = " クラス"
						}else if( /^trait(\s+)([\w\u007f-\ufffe]+)/.test(strAddTitle) ){
							strAddTitle = strAddTitle.match(/^trait(\s+)([\w\u007f-\ufffe]+)/)[2];
							addName = " トレイト";
							bTrait = true;
						}else{
							strAddTitle = "不明";
							addName = " クラス";
						}
						if( g_opt.vs != 2 ){
							AddFuncInfoBoth( nLineNum, nLinePos, strAddTitle + addName, nNest.length + nDepth );
						}else{
							AddFuncInfoBoth( nLineNum, nLinePos, strAddTitle + (bTrait?addName:""), nNest.length + nDepth, 3 );
						}
						classNameNest.push(strAddTitle);
						strAddTitle = null;
						bAddFunc = true;
						nLinePos += 4;
						continue;
					}
				}else
				// {
				if(0x7b == nCharCode){
					if( bAddFunc ){
						bAddFunc = false;
						nNest.push(nFuncNest);
						nFuncNest = 0;
					}else{
						++nFuncNest;
					}
				}else
				// }
				if(0x7d == nCharCode){
					if(0 == nFuncNest){
						if(0 < nNest.length){
							nFuncNest = nNest.pop();
							classNameNest.pop();
						}
						// else error.
					}else{
						--nFuncNest;
					}
				}else
				// ?>
				if(0x3f == nCharCode && 0x3e == strLine.charCodeAt(nLinePos+1)){
					if( 0 == nMode ){
						++nLinePos;
						nMode = 2;
					}
				}else
				// <<<
				if(0x3c == nCharCode && 0x3c == strLine.charCodeAt(nLinePos+1) && 0x3c == strLine.charCodeAt(nLinePos+2)){
					nLinePos+=2;
					if( /^\w+[\r\n]*$/.test(strLine.substr(nLinePos+1, 200))){
						nMode = 3;
						heredoc = strLine.substr(nLinePos+1, 200).match(/^[\w\u007f-\ufffe]+/)[0];
						break; // 次の行
					}else if(/^"\w+"/.test(strLine.substr(nLinePos+1, 200))){
						nMode = 3;
						heredoc = strLine.substr(nLinePos+1, 200).match(/^"([\w\u007f-\ufffe])+"/)[1];
						break;
					}else if(/^'\w+'/.test(strLine.substr(nLinePos+1, 200))){
						nMode = 3;
						heredoc = strLine.substr(nLinePos+1, 200).match(/^'([\w\u007f-\ufffe])+'/)[1];
						break; // 次の行
					}else{
						// error.
					}
				}else
				// </script>
				if(0x3c == nCharCode && "/script>" == strLine.substr(nLinePos+1, 8) ){
					if( 6 == nMode ){
						++nLinePos;
						nMode = 2;
					}
				}
			}
		}
	}
	return true;
}

function AddFuncInfoBoth(nLine, nColm, szElem, nAppNestLevel, nOpt)
{
	if( g_bAddFuncModeTree ){
		Outline.AddFuncInfo2(nLine, nColm + 1, szElem, nAppNestLevel);
	}else{
		Outline.AddFuncInfo(nLine, nColm + 1, szElem, nOpt ? nOpt : 0);
	}
}

function LoadPluginOptions()
{
	var t_val = true;
	var tmp = {};
	tmp.vs = 0;
	g_opt = tmp;
	if( !g_bLoadPluginOption ){
		return;
	}
	var LoadKeyBool = function (key, def_val)
	{
		var x = Plugin.GetOption( "Option", "OutLine" +  key );
		if( x == "" ){
			return def_val;
		}
		return "0" != x;
	};
	var LoadKeyInt = function (key, def_val)
	{
		var x = Plugin.GetOption( "Option", "OutLine" +  key );
		if( x == "" ){
			return def_val;
		}
		return parseInt(x);
	};
	tmp.vs = LoadKeyInt("ViewStyle", 0);
	g_opt = tmp;
}

function phpOutline()
{
	LoadPluginOptions();
	Outline.SetTitle( "PHP アウトライン" );
	g_bAddFuncModeTree = (g_opt.vs == 0);
	var lines = Editor.GetLineCount(0);
	var maxcolm = 0x0fffffff;
	if( g_bAddFuncModeTree ){
		Outline.SetListType( 100 ); // 汎用ツリー
		AddFuncInfoBoth(1, 0, "PHP アウトライン", 0);
		php_OutlineExec(1, 1, lines, 0, maxcolm);
	}else if( g_opt.vs == 2 ){
		Outline.SetListType( 200 ); // JavaTree
		php_OutlineExec(0, 1, lines, 0, maxcolm);
	}else{
		Outline.SetListType( 300 ); // 汎用リスト
		php_OutlineExec(0, 1, lines, 0, maxcolm);
	}
}
phpOutline();
