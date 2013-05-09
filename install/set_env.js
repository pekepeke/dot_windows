(function() {
	var env_type = "USER";
	var opt = {}, files = [];
	function alert(m) {
		WScript.Echo(m);
	}
	function dump(o) {
		var m = []; for (var k in o) { m.push(k + ":" + o[k]) }; alert(m.join("\n")); return m.join("\n");
	}
	
	(function() {		// parse options
		var i, len, param, key, val;
		var entries = [];

		param = WScript.Arguments.Unnamed;
		for (i=0, len = param.length; i<len ; i++) {
			files.push(param(i));
		}

		param = WScript.Arguments;
		for (i=0, len = param.length; i<len ; i++) {
			if (param(i).match(/^\/(\w+):?/)) {
				entries.push(RegExp.$1 + "" );
			}
		}

		param = WScript.Arguments.Named;
		for (i=0, len = entries.length; i<len ; i++) {
			key = entries[i]; val = param.Item(key);
			opt[key.toLowerCase()] = typeof val === "undefined" ? true : val;
		}
	}).call();
	
	if (files.length < 2) {
		alert("arguments error");
		return;
	}

	if (opt.system) {
		env_type = "SYSTEM";
	}
	var name = files[0], val = files[1];

	if (opt.a) {
		var sh = new ActiveXObject("WScript.Shell")
			, env = sh.Environment(env_type)
			, cwd = WScript.ScriptFullName.replace(/\\[^\\]+$/,'');
		if (opt.o || !env.Item(name)) {
			env.Item(name) = val;
		} else {
			alert("can't set env" + name + "=" + val);
		}
	}
	alert([
		env_type
		, name + "=" + val
	].join("\n"));

}).call();
