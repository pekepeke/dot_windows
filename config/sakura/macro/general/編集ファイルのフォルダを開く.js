// 編集中のファイルが存在するフォルダを開く
(function(){	//}}

	var e = Editor;
	var NOTITLE = "(無題)";
	if ( e.Expandparameter("$F") == NOTITLE) e.ExecCommand('explorer /select,"$S"',0);
//	if (e.Expandparameter("$F") == notitle) e.ExecCommand('explorer',0);
	else e.ExecCommand('explorer /select,"$F"',0);

})();
