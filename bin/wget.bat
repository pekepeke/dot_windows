@if (false)==(false) echo off
cscript //Nologo /E:JScript "%~f0" %*
goto :EOF
@end
// wget.js: dara-j http://dara-j.asablo.jp/blog/2008/06/11/3572173

var fso = new ActiveXObject("Scripting.FileSystemObject");
var shell = new ActiveXObject("WScript.Shell");

// コマンドライン引数の取得
var args = new function() {
  var args = WSH.Arguments, result = [];
  for(var col = new Enumerator( args ); ! col.atEnd(); col.moveNext()) {
    result[ result.length ] = String( col.item() );
  }
  var named = {};
  for(var col = new Enumerator( args.Named ); ! col.atEnd(); col.moveNext()) {
    named[ String( col.item() ) ] = String( args.Named.Item( col.item() ) );
  }
  var unnamed = [];
  for(var col = new Enumerator( args.Unnamed ); ! col.atEnd(); col.moveNext()) {
    unnamed[ unnamed.length ] = String( col.item() );
  }
  result.named = named;
  result.unnamed = unnamed;
  
  result.toArray = function() {
    var result = [];
    for(var i = 0, l = this.length; i < l; i++) {
      result[ i ] = /((^".*"$)|(^'.*'$))/.test( this[i] ) ?
        this[i] : [ '"', this[i], '"' ].join("");
    }
    return result;
  };
  result.toString = function() {
    return this.toArray().join(" ");
  };
  return result;
}();

// cscriptで強制起動
if( /wscript\.exe$/i.test( WSH.FullName ) ) {
  shell.Run( [
    "cscript",
    /((^".*"$)|(^'.*'$))/.test( WSH.ScriptFullName ) ? WSH.ScriptFullName : [ '"', WSH.ScriptFullName, '"' ].join(""),
    args
  ].join(" ") );
  WSH.Quit();
}

// ユーティリティ関数定義
var echo = function(s) {
  print( [ s, "\n" ].join("") );
}
var print = function(s) {
  WSH.StdOut.Write( s || "" );
}
var input = function() {
  if( arguments[0] ) print( arguments[0] );
  print( ">" );
  return WSH.StdIn.ReadLine();
}
var nameFromContentDisposition = function(xhr) {
  var parts = xhr.getResponseHeader( "Content-Disposition" ).split( /;\s*/i );
  for(var i = 0, l = parts.length; i < l; i++) {
    if( parts[i].match( /^filename=/ ) ) {
      break;
    }
  }
  if( i < l ) {
    var f = parts[i].split( /=/ )[1];
    f = f.replace( /^["']*|["']*$/g, "" );
    return f.replace( /[\\\/:,;\*\?"<>\|]/g, "_" );
  } else {
    return;
  }
}
var nameFromUrl = function(url) {
  var parts = url.split( /[\\\/]/g );
  var f = parts[parts.length - 1];
  f = f.replace( /[\\\/:,;\*\?"<>\|]/g, "_" );
  parts[parts.length - 1] = f;
  return f;
}

Error.prototype.toString = function() {
  return this.description || this.message || this.number || this;
}

if( ! args.length || /^\/(\?|(help))/i.test( args[0] ) ) {
  // 引数がないか、ヘルプスイッチが指定された場合は使い方を表示して終了
  echo( "使い方 : [cscript | wscript] wget.js [ ]" );
  echo( "オプション : " );
  echo( "        アクセスするインターネットリソースのURL" );
  echo( "  保存先ファイルパス。省略時はURLのファイル名と" );
  echo( "             同じ名前でカレントディレクトリに保存" );
  echo();
  //input( "Enter キーで終了します" );
} else {
  // メイン処理
  var url = args.unnamed[0];

  var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open( "get", url, true );
  var completed = false;
  xhr.onreadystatechange = function() {
    print( "." );
    if( xhr.readyState < 4 ) return;
    echo();
    try {
      var headers = (function(headers) {
        var result = {}, lines = headers.split( /((\r\n)|\r|\n)/g );
        for(var i = 0, l = lines.length; i < l; i++) {
          var matches = /^([^:]+): (.*)$/.exec( lines[i] );
          if( matches ) result[ matches[1].toLowerCase() ] = matches[2];
        }
        return result;
      })( xhr.getAllResponseHeaders() );
      echo( [ "ファイルサイズ : ", headers[ "content-length" ] || "不明" ].join("") );
      
      var stream = new ActiveXObject("ADODB.Stream");
      stream.Open();
      stream.Position = 0;
      stream.Type = 1;
      stream.Write( xhr.responseBody );
      var fileName = args.unnamed[1] || nameFromContentDisposition(xhr) || nameFromUrl(url);
      stream.SaveToFile( fileName, 2 );  // adSaveCreateOverWrite
      echo( "完了" );
      
    } catch(e) {
      echo( e );
    } finally {
      if( stream ) {
        try { stream.Close(); } catch(ie) {}
      }
    }
    completed = true;
  }
  print( [ "url '", url, "' に接続中..." ].join("") );
  xhr.send();
  while( ! completed ) {
    WSH.Sleep( 50 );
  }
}
