(function() {
function ADODBHandler() {
  this.init.apply(this, arguments);
}

ADODBHandler.prototype.init = function() {
  this.adTypeBinary = 1;
  this.adTypeText = 2;
  this.adSaveCreateOverWrite = 2;
  this.adSaveCreateNotExist = 1;
};

ADODBHandler.prototype.makeStream = function() {
  var stream  = new ActiveXObject('ADODB.Stream');
  stream.type = this.adTypeText;
  stream.charset = "UTF-8";
  return stream;
};

ADODBHandler.prototype.readFile = function(path) {
  var stream = this.makeStream();
  stream.open();
  stream.loadFromFile(path);
  var text = stream.readText(-1);
  stream.close();
  return text;
};

ADODBHandler.prototype.writeFile = function(path, text) {
  var stream = this.makeStream();
  stream.open();
  stream.writeText(text);
  stream.saveToFile(path, this.adSaveCreateNotExist);
  stream.close();
};


var ado = new ADODBHandler();
var text = ado.readFile("_sakura.ini");

if (!text) { return; }
text = text
  // .replace(/^\[MRU\]/m, "")
  .replace(/^MRUFOLDER\[\d+\].*$/mg, "")
  .replace(/^MRU\[\d+\].*$/mg, "")
  // .replace(/^\[Keys\]/m, "")
  .replace(/^REPLACEKEY\[\d+\]=.*$/mg, "")
  .replace(/^SEARCHKEY\[\d+\]=.*$/mg, "")
  .replace(/^GREPFILE\[\d+\]=.*$/mg, "")
  .replace(/^GREPFOLDER\[\d+\]=.*$/mg, "")
  .replace(/(^\[Grep\])/m, "$1\r\nGREPFOLDER[00]=*.*;!entries;!all-wcprops;!*.svn*;!*.bak;!*.tmp;!*.dat;!*.~???;!*.*~;!tags")
  .replace(/^szIMPORTFOLDER=.*$/m, "szIMPORTFOLDER=macro\\")
  .replace(/^\n$/mg, '')
	.replace(/\r\n|\r|\n/g, "\r\n");

ado.writeFile("sakura.ini", text);
}());
