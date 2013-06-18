Outline.SetTitle( "ƒeƒLƒXƒgƒAƒEƒgƒ‰ƒCƒ“" );	//ƒAƒEƒgƒ‰ƒCƒ“‰ğÍƒ^ƒCƒgƒ‹‚ğİ’è
Outline.SetListType( 3 );	//”Ä—pƒcƒŠ[

var filterLength = 50;		//Í”Ô†‚Å‚È‚¢‚Æ”»’f‚·‚é•¶š”
var depth = -1;				//[‚³
var markStack = "";			//‹L†ƒXƒ^ƒbƒN
var line_max = Editor.GetLineCount( 0 );
Outline.AddFuncInfo2( 1, 1, "/*** BOF ***/", 0 );

//•ÒW’†•¶‘‚ğ1s‚¸‚Â“Ç‚İ‚ñ‚Å‰ğÍ‚·‚é
for ( var line_no = 1; line_no <= line_max; line_no++ ) {
	var line_str = Editor.GetLineStr( line_no );
	line_str = line_str.substr(0, line_str.length-1);	//EOL‚ğæ‚èœ‚­

	var pretty = line_str.replace(/^\s*/, "");

	if (/^\s*[0-9‚O-‚X]+\.[0-9‚O-‚X]+\.[0-9‚O-‚X]+\.[0-9‚O-‚X]+\.[^0-9‚O-‚X]/.test(line_str) && line_str.length < filterLength+6) {
		Outline.AddFuncInfo2( line_no, line_no, pretty, 3 );
		depth = 2;
		markStack = "";
	}
	if (/^\s*[0-9‚O-‚X]+\.[0-9‚O-‚X]+\.[0-9‚O-‚X]+\.[^0-9‚O-‚X]/.test(line_str) && line_str.length < filterLength+4) {
		Outline.AddFuncInfo2( line_no, line_no, pretty, 2 );
		depth = 2;
		markStack = "";
	}
	else if (/^\s*[0-9‚O-‚X]+\.[0-9‚O-‚X]+\.[^0-9‚O-‚X]/.test(line_str) && line_str.length < filterLength+2) {
		Outline.AddFuncInfo2( line_no, line_no, pretty, 1 );
		depth = 1;
		markStack = "";
	}
	else if (/^\s*[0-9‚O-‚X]+\.[^0-9‚O-‚X]/.test(line_str) && line_str.length < filterLength) {
		Outline.AddFuncInfo2( line_no, line_no, pretty, 0 );
		depth = 0;
		markStack = "";
	}
	else if (/^\s*[mwy¡ £¢¥¤Ÿ›œ˜E¦™š‘æ‡@-‡S‡T-‡]]/.test(line_str)) {	//–{“–‚Í‹¤’Êİ’è‚©‚ç‚Æ‚è‚½‚¢c
		var mark = line_str.replace(/^\s*(.).*$/, "$1");
		//˜A”Ô‚Í“¯‚¶í—Ş‚ÆŒ©‚È‚·
		if (/[‡@-‡S]/.test(mark)) { mark = "‡@"; }
		else if (/[‡T-‡]]/.test(mark)) { mark = "‡T"; }

		if (markStack.length == 0) {
			depth++;
			Outline.AddFuncInfo2( line_no, line_no, pretty, depth );
			markStack = mark;
		} else if (mark == markStack[0]) {
			Outline.AddFuncInfo2( line_no, line_no, pretty, depth );
		} else {
			var idx = markStack.indexOf(mark);
			if (idx < 0) {
				depth++;
				Outline.AddFuncInfo2( line_no, line_no, pretty, depth );
				markStack = mark + markStack;
			} else {
				depth = depth - idx;
				Outline.AddFuncInfo2( line_no, line_no, pretty, depth );
				markStack = markStack.substr(idx);
			}
		}
	}
	else if (/^\s*(–ÚŸ|‘O‘‚«|•t˜^|Ql|—pŒê|table of contents|preface|appendix|glossary|reference)/i.test(line_str)) {
		Outline.AddFuncInfo2( line_no, line_no, pretty, 0 );
	}
}
Outline.AddFuncInfo2( line_max, line_max, "/*** EOF ***/", 0 );

