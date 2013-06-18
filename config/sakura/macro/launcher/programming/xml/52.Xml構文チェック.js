main();

function main(){
	var e = Editor;
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}

	// 変換
	var text = e.GetSelectedString(0);		 // 選択範囲の文字列を取得

	var dom = new ActiveXObject("Microsoft.XMLDOM");
	dom.async = false;
	//if (!dom.load(text)) {
	if (!dom.loadXML(text)) {
		var error = dom.parseError;
		alert("XML文法エラーが発生しました :"+ error.reason +
		     "\nURL :"+ error.reason +
		     "\n行 :"+ error.line +", 列 :"+ error.linepos);
		//    document.selection.SetActivePoint(eePosLogicalA, error.linepos, error.line);
		e.Jump(error.line,0);//error.line)
		for (var i=0;i<error.linepos-1;i++) e.Right();

	} else {
		alert("この文書はXMLの文法を満たしています");
	}
}

function alert(msg){
	var script = new ActiveXObject("ScriptControl");
	script.Language = "VBScript";
	var m=(''+msg).replace(/"/g, '""').replace(/[\r\n]+/g, '" & vbCrLf & "'); // "
	script.AddCode('MsgBox("'+m+'")');
}
