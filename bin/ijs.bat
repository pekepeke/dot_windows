@if(0)==(0) ECHO OFF
@ECHO OFF
CScript.exe //NoLogo //E:JScript "%~f0" %*
GOTO :EOF
@end
(function(){
  if(/wscript\.exe$/i.test(WScript.FullName)){
    (new ActiveXObject('WScript.Shell')).run('cscript "' + WScript.ScriptFullName + '"');
    return;
  }

  var echo = function(s){ WScript.echo(s); };
  var alert = function(s){ echo(s); };
  var dump = function(o){ for(var k in o) echo(k + ' = ' + o[k]); }
  var ls,dir,cd,prompt;
  (function(){
    this.fso = new ActiveXObject("Scripting.FileSystemObject");
    this.sh = new ActiveXObject("WScript.Shell");
    this.script = new ActiveXObject("ScriptControl");
    this.script.Language = "VBScript";
    cd = function(dir){
      if (!dir) {
        alert(this.sh.CurrentDirectory);
        return;
      }
      var path = this.fso.GetAbsolutePathName(dir);
      if (this.fso.FolderExists(path)) this.sh.CurrentDirectory = path;
      else {
        WScript.stderr.WriteLine("指定したディレクトリが存在しません。- "+path);
      }
    };
    ls = function(){
      var path = this.sh.CurrentDirectory;
      var folder = this.fso.GetFolder(path);
      var list = [];
      WScript.stdout.WriteLine("-- " +path+ " --\n" );
      for (var f = new Enumerator(folder.SubFolders);!f.atEnd(); f.moveNext()) list.push(f.item().name+"\\");
      for (var f = new Enumerator(folder.Files);!f.atEnd(); f.moveNext()) list.push(f.item().name+"");
      for (var i=0,l=list.length,buf=""; i<l ;i++){
        var f=list[i], spc = 20-f.length;
        buf += f + (spc>0? ( new Array(spc).join(" ") ):" ");
        if ( (i+1)%3==0 ) { WScript.stdout.WriteLine(buf); buf=""; }
      }
    };
    dir = ls;
    function _vbescape(v) { return ("" + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "'); }	// "
    prompt = function(m,t,d){
      var src = 'InputBox("' + _vbescape(m) + '", ' +
      '"' + _vbescape( t || '') + '", ' +
      '"' + _vbescape( d || '') + '")';
      this.script.AddCode("Function Hoge() : Hoge = " + src + " : End Function");
      return this.script.Run("Hoge");
    }
  })();

  var stdin = WScript.stdin;
  var stdout = WScript.stdout;
  var stderr = WScript.stderr;
  var src="";
  while(true){
    WScript.stdout.Write('js>');
    src += stdin.readline();
    if(src == 'exit') break;
    if( src.match(/^(ls|cd|dir)[ \t]*(.*)/) ) {var arg = RegExp.$2;src = RegExp.$1; src+="(\""+arg.replace(/([^0-9A-Za-z_])/g, '\\$1') +"\");";}
    if(src == ';'){
      src = (function(){
        var lines = [];
        while(true){
          var line = stdin.readline();
          if(line == ';') return lines.join('\n')+";";
          lines.push(line);
        }
      })();
    }
    try{
      var ret = eval(src);
      if(ret) echo(ret);
    }catch(e){
      WScript.stderr.WriteLine(e.message);
    }
    src="";
  }
  stderr.Close();
  stdout.Close();
  stdin.Close();
})();
// vim:set ft=javascript ff=dos fenc=cp932:
