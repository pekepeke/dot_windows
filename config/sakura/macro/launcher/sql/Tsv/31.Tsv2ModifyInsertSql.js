// tsv から insert文を作成

(function(){
	// 改行コードを現在の文書に合わせる
	var modifyReturnCode = function(text){
		return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, ["\r\n","\r","\n"][Editor.GetLineCode()]);
	};
	// tsv -> insert into ...
	var tsvToSqlInsert = function(text, tableName, ignore_header_flag, add_colname_flag){
		var line=text.split("\n");
		var head;
		var ret = [];
		var put_header = !ignore_header_flag || add_colname_flag;
		
		for (var i=0;i<line.length;i++){
			if (line[i] == null || line[i].replace(/(^\s+|\s+$)/g,"") == '') continue;
			var item=line[i].split("\t");
			if (put_header && i<=0) head = item;
			else {
				var sql = [];
				sql.push("INSERT INTO "+tableName);
				if (put_header) sql.push('\t('+head.toString()+') ');
				sql.push(" VALUES ( ");//)
				
				for (var j=0;j<item.length;j++){
					var s = "\t";
					if (j>0) s += ", ";
					if (item[j]) s += "'" + item[j] + "'";
					else s +="NULL";
					sql.push(s+'\t\t\t-- '+(head.length > j ? head[j] : ""));
				}//(
				sql.push(");");
				ret.push(sql.join("\n"));
			}
		}
		return ret.join("\n");
	};
	// vbs 関数
	var vbs = {
		_control : new ActiveXObject("ScriptControl"),	_lang    : "VBScript",
		_escape  : function(v){
			return((""+v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "')); // "
		},
		prompt   : function (msg, title, def){
			return(this.eval(['InputBox(','"', this._escape(msg),'", ' ,'"' , this._escape(title || '') , '", ' ,'"' , this._escape(def || '') , '")'].join("") ));
		},
		alert    : function (msg){ this.exec(['MsgBox("', this._escape(msg), '")'].join('')); },
		exec     : function (src){
			this._control.Language = this._lang;
			this._control.AddCode(src);
		},
		eval     : function (src){
			this._control.Language = this._lang;
			this._control.AddCode(["Function Hoge() : Hoge = ", src, " : End Function"].join(""));
			return(this._control.Run("Hoge"));
		}
	};
	
	var e = Editor;
	var table_name = vbs.prompt("テーブル名を入力して下さい。", "テーブル名の入力", e.ExpandParameter("$C"));
	if (!table_name) return;
	
	//e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
	    e.SelectAll();
	}
	
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// 改行を\nで統一
	if (!text) return;
	
	e.InsText( modifyReturnCode(
		tsvToSqlInsert( text, table_name, false, true)
	));
	//e.MoveHistPrev();
})();

