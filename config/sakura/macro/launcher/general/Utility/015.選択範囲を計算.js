// ƒTƒNƒ‰ƒGƒfƒBƒ^ƒ}ƒNƒƒeƒ“ƒvƒŒ
(function(){//})

	var wideChars = "‚O‚P‚Q‚R‚S‚T‚U‚V‚W‚X‚‚‚‚ƒ‚„‚…‚†‚‡‚ˆ‚‰‚Š‚‹‚Œ‚‚Ž‚‚‚‘‚’‚“‚”‚•‚–‚—‚˜‚™‚šij–~^€{|O“F”•bD";
	var asciiChars = "0123456789abcdefghijklmnopqrstuvwxyz()**//+-^%:#&|=.";

	// main
	var e = Editor;
	// Œ…ˆÊ’u•œŒ³—p
	e.MoveHistSet();
	// ‘I‘ð”ÍˆÍ‚ª‚È‚¯‚ê‚ÎI—¹
	if (e.IsTextSelected == 0) return;//e.SelectAll();
   
	text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ‰üs‚ð\n‚Å“ˆê
   
	e.InsText( modifyReturnCode(
		convertString(text)
		));
	// Œ…ˆÊ’u‚ð•œŒ³
	e.MoveHistPrev();
	return;
	
	// ‰üsƒR[ƒh‚ðŒ»Ý‚Ì•¶‘‚É‡‚í‚¹‚é
	function modifyReturnCode(text){
		var e = Editor;
		var l = new Array("\r\n","\r","\n");
	//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
		return text.replace(/\n/g,l[e.GetLineCode()]);
	}

	// •¶Žš—ñ¶¬
	function convertString(text){
		var hasAscii = false;
		var hasTime = false;
		var hasRetCode = false;
		var ret = "";
		
		if (text.match( /[a-zA-Z0-9\(\)\*/+-^%:#&|=\.]/ )) hasAscii = true;
		if (text.indexOf("\n") >= 0) hasRetCode = true;
		
		for (var i=0; i<asciiChars.length; i++) 
			text = text.replace( eval("/"+wideChars.charAt(i)+"/g" ), asciiChars.charAt(i));
		
		var regex = new RegExp("([0-9]+):([0-9]+)");
		var arr;
		while ( arr = regex.exec(text) ) {
			//text = text.replace(/([0-9]+):([0-9]+)/, (arr[1]-0) + ((arr[2]-0)/60) );
			text = text.replace(/([0-9]+):([0-9]+)/, (arr[1]-0)*60 + (arr[2]-0) );
			hasTime = true;
		}
		
		text = text.replace(/(\-?[0-9\.]+)\^(\-?[0-9\.]+)/g, "Math.pow($1,$2)")
			.replace(/(abs|ceil|floor|max|min|round|acos|asin|atan|atan2|cos|exp|log|random|sin|sqrt|tan)\s*\(/ig, "Math.$&")	//)
			.replace(/pi\s*\(\s*\)/g, "3.1415926535897932");
		var ret = new Number(eval(text));
		
		if (hasTime) {
	//		var hour = parseInt(ret);
	//		var min = Math.round( (ret%1)*60);	//Math.floor( (ret%1)*60);
	//		hour = "00"+hour; min = "00"+min;
	//		ret = hour.substring(hour.length-2) + ":" + min.substring(min.length-2)
			var hour = "00"+ Math.floor(ret/(60*60));
			var min = "00"+ Math.floor((ret%(60*60))/60);
			var sec = "00"+ Math.floor(ret%60);
			var msec = (Math.round(ret%1*1000)/1000).toString();
			
			ret = hour.substring(hour.length-2) + ":" + min.substring(min.length-2) + ":" + sec.substring(sec.length-2);
			if (msec.match(/^0\./)) ret += msec.replace(/^0/,'');
		}
		
		ret = ret.toString();
		if (!hasAscii) {
			for (var i=0; i<asciiChars.length; i++) {
				var ch = asciiChars.charAt(i).replace(/([\[\]\.\?\*\+\(\)\|])/g,'\\$&');
				ret = ret.replace( eval("/"+ch +"/g" ), wideChars.charAt(i));
			}
		}
		if (hasRetCode) ret += "\n";
		return ret;
	}
})();
