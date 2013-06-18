//http://labs.cybozu.co.jp/blog/kazuho/archives/2006/09/wiki_formatter.php
(function() {
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var sh = new ActiveXObject("WScript.Shell");
	function main(){
		var e = Editor;

		//e.MoveHistSet();		// 桁位置復元用
		// 選択範囲がなければ全選択
		if (e.IsTextSelected == 0) e.SelectAll();
	  
		text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	  
		var formatter = new Wiki.Formatter({
		initHandlers: function(){
			this.initHandlers();
	//		// 順序なしリストのレベル 1-3 として ・ を登録
	//		this.addTaggedStatement('・', '<li>', 'ul', 1);
	//		this.addTaggedStatement('・・', '<li>', 'ul', 2);
	//		this.addTaggedStatement('・・・', '<li>', 'ul', 3);
	//		// &fontweight(フォントの重さ) { ... } という記法を追加
	//		this.addExpression(
	//				function (stack) {
	//					stack[1].out +=
	//								'<span style="font-weight: " + stack[0].params + ';">'	//"
	//								+ stack[0].out
	//								+ '</span>';
	//				},
	//				'&fontweight',	// {
	//				'\}',
	//				'&fontweight\\\(\\\s*\\\d+\\\s*)\\\s*\\\{');	//}
			}
		});
		var path = getTempPath() + ".html";
		saveFile(path, formatter.format(text));
		if (!isRun("iexplore.exe")) sh.Run( '"'+path+'"' , 1, false);
		//deleteFile(path);
	}

	// 改行コードを現在の文書に合わせる
	function modifyReturnCode(text){
		var e = Editor;
		var l = new Array("\r\n","\r","\n");
	//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
		return text.replace(/\n/g,l[e.GetLineCode()]);
	}

	function isRun(procName){
	var procs = GetObject("winmgmts:\\\\.\\root\\CIMV2").ExecQuery("select * from Win32_Process where Name = '" +procName+ "'");
		return procs.Count;
	}

	function readFile(path) {
		var ForReading = 1;
		var text = '';
		if (!fso.FileExists(path)) return '';
		var stream = fso.OpenTextFile(path, ForReading);
		if (!stream.AtEndOfStream) text = stream.ReadAll();
		stream.Close();
		return text;
	}

	// ファイル保存
	function saveFile(path, text){
		stream = fso.CreateTextFile( path, true);
		stream.Write( text );
		stream.Close();
		return;
	}

	// ファイル削除
	function deleteFile(path) {
		if (fso.FileExists(path)) fso.DeleteFile(path, true);
	}
	// テンポラリファイルパス取得
	function getTempPath(){
		return fso.GetSpecialFolder(2) + "\\" + "tmp.wiki2html.js.tmp";//+ fso.getTempName();
	}

	if (typeof Wiki != 'object' || typeof Wiki != 'function') {
			var Wiki = {};
	}

	/*
	 * Copyright (C) 2006  Cybozu Labs, Inc.
	 * 
	 * This program is free software; you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation; version 2 of the License.
	 * 
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.

	 * You should have received a copy of the GNU General Public License along
	 * with this program; if not, write to the Free Software Foundation, Inc.,
	 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
	 */


	// core code starts here

	Wiki.Formatter = function (args) {
			if (typeof args != 'object') {
					args = {};
			}
			// clear fields
			this.out = [];
			this.modename = undefined;
			this.modelevel = 0;
			// set attributes and callbacks
			this.autoLink = typeof args.autoLink != 'undefined' ? args.autoLink : true;
			this.nameToLink = args.nameToLink || undefined;
			this.foldLines = ! ! args.foldLines;
			this.addNote = args.addNote || function (note) {
					if (! this.notes) {
							this.notes = [];
					}
					this.notes.push('*' + (this.notes.length + 1) + ': ' + note);
					return '<sup>*' + this.notes.length + '</sup>';
			};
			this.notesToHTML = args.noteToHTML || function () {
					return this.notes ?
							'<div style="notes">\n'
									+ this.notes.join('<br />\n')
									+ '</div>\n' :
							'';
			};
			// setup handlers
			this.filters = [];
			this.statements = [];
			this.expressions = {};
			(args.initHandlers || this.initHandlers).call(this);
	};

	Wiki.Formatter.prototype.dupRE = function () {
			var properties = [
					'$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8', '$9',
					'lastMatch',
					'leftContext',
					'rightContext'
			];
			var o = {};
			for (var i = 0; i < properties.length; i++) {
				 o[properties[i]] = RegExp[properties[i]];
			}
			return o;
	};

	Wiki.Formatter.prototype.escapeHTML = function (text) {
			return text.replace(
					/[<>"&]/g,
					function (m) {
							return {
									'<': '&lt;',
									'>': '&gt;',
									'"': '&quot;',
									'&': '&amp;'
							}[m];
					});
	};

	Wiki.Formatter.prototype.buildCloseTag = function (tag) {
			var closeTag = tag.replace(/^\s*<(\S+).*>\s*$/, '</$1>');
			if (tag == closeTag) {
					alert('Failed to convert ' + tag + ' to a close tag');
					throw 'failed to convert tag';
			}
			return closeTag;
	};

	Wiki.Formatter.prototype.buildLink = function (text, url, noEscape) {
			if (! noEscape) {
					text = this.escapeHTML(text);
			}
			return '<a href="' + this.escapeHTML(url) + '">' + text + '</a>';
	};

	Wiki.Formatter.prototype.compileLeaf = function (text, isInLink) {
			var out = '';
			var linkify = ! isInLink && this.autoLink;
			while (text.match(/((?:https?|ftp):\/\/\S+)|([\w\-\.]+\@[A-Za-z0-9\-\.]+\.[A-Za-z]{2,})|([a-z_]*[A-Z][a-z_]*[A-Z][A-Za-z_]*)/)) {
					var r = this.dupRE();
					out += this.escapeHTML(r.leftContext);
					text = r.rightContext;
					if (out.match(/\\\\$/)) {
							out = RegExp.leftContext + this.escapeHTML(r.lastMatch);
					} else if (r.$1 && linkify) {
							out += this.buildLink(r.$1, r.$1);
					} else if (r.$2 && linkify) {
							out += this.buildLink(r.$2, 'mailto:' + r.$2);
					} else if (r.$3 && linkify && this.nameToLink) {
							out += this.buildLink(r.$3, this.nameToLink.call(this, r.$3));
					} else {
							out += this.escapeHTML(r.lastMatch);
					}
			}
			out += this.escapeHTML(text);
			return out;
	};

	Wiki.Formatter.prototype.initLineCompiler = function () {
			var reMap = {};
			for (var tag in this.expressions) {
					var e = this.expressions[tag];
					if (e && e.openRE) {
							reMap[this.expressions[tag].openRE] = 1;
					} else {
							reMap[tag.replace(/(.)/g, '\\$1')] = 1;
					}
			}
			var reList = [];
			for (var i in reMap) {
					reList.push('\\\\\\\\' + i);
					reList.push(i);
			}
			reList.sort(
					function (a, b) {
							return b.length - a.length;
					});
			this.compileLineRE = new RegExp(reList.join('|'));
			if (! this.compileLineRE) {
					alert("failed to compile expression table");
			}
	}

	Wiki.Formatter.prototype.compileLine = function (line) {
			var stack = [
					{
							expression: {},
							isInLink: false,
							out: ''
					}
			];
			
			this.line = line;
			var leaf = '';
			while (this.line.match(this.compileLineRE)) {
					var r = this.dupRE();
					this.line = r.rightContext;
					leaf += r.leftContext;
					if (r.lastMatch.match(/^\\\\/)) {
							leaf += RegExp.rightContext;
					} else if (stack[0].expression.closeTag == r.lastMatch) {
							stack[0].out += this.compileLeaf(leaf, stack[0].isInLink);
							leaf = '';
							stack[0].expression.call(this, stack);
							stack.shift();
					} else {
							var name = r.lastMatch;
							var params;
							if (r.lastMatch.match(/^(&[a-z]+)\((.*?)\)/)) {
									name = RegExp.$1;
									params = RegExp.$2;
							}
							var expression = this.expressions[name];
							if (expression
									&& (expression.isLink != 1 || ! stack[0].isInLink)) {
									stack[0].out += this.compileLeaf(leaf, stack[0].isInLink);
									leaf = '';
									if (expression.closeTag) {
											stack.unshift({
													expression: expression,
													out: '',
													params: params
											});
											stack[0].isInLink =
													stack[1].isInLink + expression.isLink > 0;
									} else {
											expression.call(this, stack);
									}
							} else {
									leaf += r.lastMatch;
							}
					}
			}
			stack[0].out += this.compileLeaf(leaf + this.line, stack[0].isInLink);
			while (stack.length != 1) {
					stack[0].expression.call(this, stack, true);
					stack.shift();
			}
			
			return stack[0].out;
	};

	Wiki.Formatter.prototype.taggedLine = function (tag, text) {
			this.out.push(tag + this.compileLine(text) + this.buildCloseTag(tag));
	};

	Wiki.Formatter.prototype.mode = function (name, level) {
			if (this.modename == name && this.modelevel == level) {
					return;
			}
			if (this.foldLines &&
					this.out.length != 0 && this.out[this.out.length - 1] == '<AUTOBR>') {
					this.out.pop();
			}
			if (this.modename != name) {
					for (; this.modelevel != 0; --this.modelevel) {
							this.out.push('</' + this.modename + '>');
					}
					this.modename = name;
			}
			for (; this.modelevel < level; ++this.modelevel) {
					this.out.push('<' + name + '>');
			}
			for (; level < this.modelevel; --this.modelevel) {
					this.out.push('</' + name + '>');
			}
	};

	Wiki.Formatter.prototype.sortStatements = function () {
			this.statements.sort(
					function (a, b) {
							var d = b.pattern.length - a.pattern.length;
							if (d != 0) {
									return d;
							}
							if (b.pattern < a.pattern) {
									return -1;
							} else if (b.pattern > a.pattern) {
									return 1;
							}
							return b.index - a.index;
					});
	};

	Wiki.Formatter.prototype.format = function (text) {
			var lines = text.split('\n');
			this.initLineCompiler();
			this.sortStatements();
			for (var i = 0; i < lines.length; i++) {
					var l = lines[i];
					for (var j = 0; j < this.filters.length; j++) {
							l = this.filters[j].call(this, l);
							if (typeof l == 'undefined') {
									break;
							}
					}
					if (typeof l == 'undefined') {
							continue;
					}
					for (var j = 0; j < this.statements.length; j++) {
							var pat = this.statements[j].pattern;
							if (l.substring(0, pat.length) == pat) {
									this.statements[j].call(this, l.substring(pat.length));
									break;
							}
					}
					if (j == this.statements.length) {
							if (l == '') {
									this.mode();
							} else {
									this.mode('p', 1);
									this.out.push(this.compileLine(l));
									if (this.foldLines) {
											this.out.push('<AUTOBR>');
									}
							}
					}
			}
			this.mode();
			for (var i = 0; i < this.out.length; i++) {
					if (this.out[i] == '<AUTOBR>') {
							 this.out[i] = '<br />';
					}
			}
			
			return this.out.join('\n') + '\n' + this.notesToHTML();
	};

	Wiki.Formatter.prototype.addExpression = function (func, openTag, closeTag, openRE) {
			var expression = function () {
					func.apply(this, arguments);
			};
			expression.openTag = openTag;
			expression.openRE = openRE;
			this.expressions[openTag] = expression;
			if (typeof closeTag != 'undefined') {
					expression.closeTag = closeTag;
					if (typeof this.expressions[closeTag] == 'undefined') {
							this.expressions[closeTag] = false;
					}
			}
			expression.isLink = 0;
			return expression;
	};

	Wiki.Formatter.prototype.addTagExpression = function (htmlTag, openTag, closeTag, openRE) {
			var handler;
			if (closeTag) {
					handler = function (stack) {
							stack[1].out +=
									htmlTag + stack[0].out + this.buildCloseTag(htmlTag);
					};
			} else {
					handler = function (stack) {
							stack[0].out += htmlTag;
					};
			}
			this.addExpression(handler, openTag, closeTag, openRE);
	};

	Wiki.Formatter.prototype.addStatement = function (pat, func) {
			var f = function () { func.apply(this, arguments); }
			f.pattern = pat;
			f.index = this.statements.index;
			this.statements.push(f);
	};

	Wiki.Formatter.prototype.addTaggedStatement = function (pat, tag, mode, level) {
			this.addStatement(
					pat,
					function (text) {
							this.mode(mode, level);
							this.taggedLine(tag, text);
					});
	};

	Wiki.Formatter.prototype.addFilter = function (func) {
			this.filters.push(func);
	};

	// core code ends here

	Wiki.Formatter.prototype.initHandlers = function () {
			// add filters
			this.addCommentFilter(/^\/\//);
			this.addQuoteFilter();
			// add statement handlers
			this.addTaggedStatement('!', '<h1>');
			this.addTaggedStatement('!!', '<h2>');
			this.addTaggedStatement('!!!', '<h3>');
			this.addTaggedStatement('*', '<h1>');
			this.addTaggedStatement('**', '<h2>');
			this.addTaggedStatement('***', '<h3>');
			this.addTaggedStatement('-', '<li>', 'ul', 1);
			this.addTaggedStatement('--', '<li>', 'ul', 2);
			this.addTaggedStatement('---', '<li>', 'ul', 3);
			this.addTaggedStatement('+', '<li>', 'ol', 1);
			this.addTaggedStatement('++', '<li>', 'ol', 2);
			this.addTaggedStatement('+++', '<li>', 'ol', 3);
			this.addDefListStatement(':', '|');
			this.addTableStatement('|');
			this.addTableStatement(',');
			this.addPreStatement(' ');
			this.addPreStatement('\t');
			this.addHRStatement('----');
			// add expression handlers
			this.addTagExpression('<br>', '~~');
			this.addTagExpression('<em>', "''", "''");
			this.addTagExpression('<i>', "'''", "'''");
			this.addTagExpression('<del>', '%%', '%%');
			this.addTagExpression('<ins>', '%%%', '%%%');
			this.addTagExpression('<sub>', '__', '__');
			this.addSizeExpression();
			this.addColorExpression();
			if (this.nameToLink) {
					this.addWikiLinkExpression('[[', ']]');
			}
			if (this.addNote) {
					this.addNoteExpression('((', '))');
			}
			this.addLinkExpression();
	};

	Wiki.Formatter.prototype.addCommentFilter = function (pat) {
			this.addFilter(
					function (line) {
							return line.match(pat) ? undefined : line;
					});
	};

	Wiki.Formatter.prototype.addQuoteFilter = function () {
			this.quoteFilter = {
					level: 0
			};
			this.addFilter(
					function (line) {
							var newLevel = 0;
							if (line.match(/^>{1,3}/)) {
									line = RegExp.rightContext;
									newLevel = RegExp.lastMatch.length;
							}
							if (this.quoteFilter.level != newLevel) {
									this.mode();
									for (;
											newLevel < this.quoteFilter.level;
											--this.quoteFilter.level) {
											this.out.push('</blockquote>');
									}
									for (;
											this.quoteFilter.level < newLevel;
											++this.quoteFilter.level) {
											this.out.push('<blockquote>');
									}
							}
							return line;
					});
	};

	Wiki.Formatter.prototype.addWikiLinkExpression = function (start, end) {
			var expression = this.addExpression(
					function (stack) {
							stack[1].out += this.buildLink(
									stack[0].out,
									this.nameToLink.call(
											this, this.stripTags(stack[0].out)),
									true);
					},
					start,
					end);
			expression.isLink = 1;
	};

	Wiki.Formatter.prototype.addNoteExpression = function (start, end) {
			var expression = this.addExpression(
					function (stack) {
							stack[1].out += this.addNote(stack[0].out);
					},
					start,
					end);
			expression.isLink = -1;
	};

	Wiki.Formatter.prototype.addLinkExpression = function () {
			var expression = this.addExpression(
					function (stack, abort) {
							if (abort) {
									stack[1].out += '\[' + stack[0].out;
							} else if (this.line.match(/\s*(.*?)\s*\]/)) {
									this.line = RegExp.rightContext;
									stack[1].out += this.buildLink(stack[0].out, RegExp.$1, true);
							} else {
									stack[1].out += '\[' + stack[0].out + '|';
							}
					},
					'\[',
					'|');
			expression.isLink = 1;
	};

	Wiki.Formatter.prototype.addSizeExpression = function () {
			this.addExpression(
					function (stack) {
							stack[1].out +=
									'<span style="font-size: ' + stack[0].params + ';">'
									+ stack[0].out
									+ '</span>';
					},
					'&size',
					'\}',
					'&size\\\(\\\s*\\\d+\\\s*\\\)\\\s*\\\{');
	};

	Wiki.Formatter.prototype.addColorExpression = function () {
			this.addExpression(
					function (stack) {
							var params = stack[0].params.split(',', 2);
							for (var i = 0; i < params.length; i++) {
									if (params[i].match(/([A-Za-z#0-9]+)/)) {
											params[i] =
													(['color:', 'background-color:'])[i] + RegExp.$1 + ';';
									} else {
											params[i] = '';
									}
							}
							stack[1].out +=
									'<span style="' + params.join(';') + '">'
									+ stack[0].out
									+ '</span>';
					},
					'&color',
					'\}',
					'&color\\\(.*?\\\)\\\s*\\\{');
	};

	Wiki.Formatter.prototype.addDefListStatement = function (start, sep) {
			var sepRE = new RegExp(sep.replace(/(.)g/, '\\$1'));
			this.addStatement(
					start,
					function (text) {
							this.mode('dl', 1);
							if (text.match(sepRE)) {
									var title = RegExp.leftContext, detail = RegExp.rightContext;
									this.taggedLine('<dt>', title);
									this.taggedLine('<dd>', detail);
							} else {
									this.taggedLine('<dt>', text);
							}
					});
	};

	Wiki.Formatter.prototype.addTableStatement = function (sep) {
			var sepRE = new RegExp(
					'^\\s*(?:(\\\')(.*?)\\\'|(\\")(.*?)\\"|(.*?))\\s*\\' + sep);
			var endRE = new RegExp('\\' + sep + '\\s*$');
			this.addStatement(
					sep,
					function (text) {
							this.mode('table', 1);
							this.out.push('<tr>');
							if (! text.match(endRE)) {
									text += sep;
							}
							while (text.match(sepRE)) {
									text = RegExp.rightContext;
									this.taggedLine(
											'<td>',
											RegExp.$1 ?
													RegExp.$2 :
													RegExp.$3 ? RegExp.$4 : RegExp.$5);
							}
							this.out.push('</tr>');
					});
	};

	Wiki.Formatter.prototype.addPreStatement = function (pat) {
			this.addStatement(
					pat,
					function (text) {
							this.mode('pre', 1);
							this.out.push(this.compileLeaf(text));
					});
	};

	Wiki.Formatter.prototype.addHRStatement = function (pat) {
			this.addStatement(
					pat,
					function (text) {
							this.mode();
							this.out.push('<hr />');
					});
	};

	main();
})();
