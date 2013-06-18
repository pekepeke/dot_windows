(function(){//})
	var info = [{
		'n':'英辞朗で検索',
		'e':false,
		'u':'http://eow.alc.co.jp/	/UTF-8/?ref=sa'
	}, {
		'n':'MSDN検索',
		'e':true,
		'u':'http://search.msdn.microsoft.com/Default.aspx?query=	&brand=msdn&locale=ja-jp&refinement=00&lang=ja-jp'
	}, {
		'n':'Google',
		'e':true,
		'u':'http://www.google.co.jp/search?hl=ja&q=	'
	}, {
		'n':'インフォシーク国語検索',
		'e':true,
		'u':'http://jiten.www.infoseek.co.jp/Kokugo?sm=1&pg=result_k.html&col=KO&sv=DC&qt=	'
	}
	/*
	, {
		'n':'',
		'e':true,
		'u':'http://'
	} 
	*/
	];

	var key = Editor.ExpandParameter("$C");
	if (!key) return;
	var popup = new ActiveXObject("EditorHelper.PopUp");
	for (var i=0; i<info.length; i++){
		popup.AddMenu(info[i].n, i+1);
	}
	var idx = popup.TrackMenu() - 1;
	
	if (idx < 0) return;
	if (info[idx].e) key = escape(key);
	var url = info[idx].u.replace(/\t/, key);
	var ie =  new ActiveXObject("InternetExplorer.Application");
	ie.Visible = true;        // True
	ie.Navigate( url );
})();
