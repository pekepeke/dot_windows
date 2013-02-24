@if(0)==(0) ECHO OFF
@ECHO OFF
CScript.exe //NoLogo //E:JScript "%~f0" %*
GOTO :EOF
@end
(function(){
  var TARGET = "%HOME%\\bin"
    , OUTPUT_BIN_DIR = "%HOME%\\.windows\\usr\\bin"
  if(/wscript\.exe$/i.test(WScript.FullName)){
    (new ActiveXObject('WScript.Shell')).run('cscript "' + WScript.ScriptFullName + '"');
    return;
  }

  var echo = function(s){ WScript.echo(s); }
    , alert = function(s){ echo(s); }
    , dump = function(o){ for(var k in o) echo(k + ' = ' + o[k]); }
    , fso = new ActiveXObject("Scripting.FileSystemObject")
    , sh = new ActiveXObject("WScript.Shell");
  
  var bin_dir = sh.ExpandEnvironmentStrings(TARGET);
  
  var files = (function() {
      var folder = fso.GetFolder(bin_dir)
      , fpath, s, f, line, items, i, l, vmname;
      for (f = new Enumerator(folder.Files);!f.atEnd(); f.moveNext()) {
        fpath = f.item() + "";//bin_dir + '\\' + 
        
        s = fso.OpenTextFile(fpath, 1, false, 0);
        line = s.ReadLine()
        s.Close();
        items = line.split(" ");
        for (i=0,l=items.length; i<l ; i++) {
          vmname = basename(items[i]);
          if (vmname == "env" || vmname == '#!') continue;
          if (vmname.match(/sh$/)) break;
          make_cmd(fpath, vmname);
          break;
        }
      }
  })();

  function basename(s) {
    return s.replace(/^.*[\/\\]/, '');
  }
  function make_cmd(fpath, vmname) {
    var src = ['@echo OFF', vmname + ' ' + TARGET + '\\%~n0 %*'].join("\r\n")
      , base = basename(fpath)
      , bin = sh.ExpandEnvironmentStrings(OUTPUT_BIN_DIR + "\\" + base + ".cmd");
      alert(bin);
    var s = fso.OpenTextFile(bin, 2, true);
    s.WriteLine(src);
    s.Close();
  }
})();
// vim:set ft=javascript ff=dos fenc=cp932:
