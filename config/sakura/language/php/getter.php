<?
	function skip($data , $ser)
	{
		return substr( strstr($data , $ser) , strlen($ser) );
	}

	function cut($data , $ser)
	{
		return substr($data , 0 , strlen($data) - strlen( skip($data , $ser) ) - strlen($ser) );
	}

	//start ～ end までの取得.
	function bitween($data , $start ,$end)
	{
		return cut( skip($data , $start ) ,$end );
	}

	//
	function getFunction($url , $func)
	{
		$data =  `curl $url`;

		$setumei = bitween($data ,'CLASS="refnamediv"' , 'CLASS="refsect1"' );
		$setumei = bitween($setumei ,'&nbsp;--&nbsp;' , '</DIV' );

		$teige = bitween($data ,'CLASS="refsect1"' , 'CLASS="function"' );
		$teige = bitween($teige ,'</H2' , '<BR' );
		$teige = skip($teige ,'>' );
		//タグを抜く.
		$teige = preg_replace(  "'<[\/\!]*?[^<>]*?>'si" , '' , $teige  );
		
		echo "${func} /// $teige\\n$setumei<br>";
		flush();
	}
	

	function getKeyWord($dir , $url)
	{
		$ret = "";
		$data = `curl '$url'`;
		$data = bitween($data , 'CLASS="TOC"' , '></DIV' );

		while($data)
		{
			$data = skip($data , 'HREF="');
			$next = skip($data , '"');
			$p = substr($data , 0 , strlen($data) - strlen($next) - 1);
			
			$func = bitween($next , '>' ,  '<');

			if (strlen($func) >= 1)
			{
				//キーワードヘルプファイルの場合位置を実行
				getFunction($dir.$p , $func) ;

				//キーワードファイルの場合はこっちを実行
				//echo $func . '<br>';
			}
		}
	}

	function getIndex($dir , $url)
	{
		$data = `curl '$url'`;
		$data = bitween($data , 'CLASS="TOC"' , '></DIV' );

		while($data)
		{
			$data = skip($data , 'HREF="');
			$next = skip($data , '"');
			$p = substr($data , 0 , strlen($data) - strlen($next) - 1);

			getKeyWord($dir , $dir.$p );
		}
	}
	

//テスト	
//	getKeyWord("http://www.php.net/manual/ja/" , "http://www.php.net/manual/ja/ref.apache.php");
//常に細心だけど重い
//	getIndex("http://www.php.net/manual/ja/" , "http://www.php.net/manual/ja/funcref.php");
//ローカルに展開してから実行の場合
	getIndex("http://192.168.1.30/b/" , "http://192.168.1.30/b/funcref.html");

?>