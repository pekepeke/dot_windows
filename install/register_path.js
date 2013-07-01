var REGIST_ENV_TYPE = "USER";		// "SYSTEM" or "USER"

(function() {
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
			"use strict";

			if (this == null) {
				throw new TypeError();
			}

			var t = Object(this);
			var len = t.length >>> 0;

			if (len === 0) {
				return -1;
			}

			var n = 0;

			if (arguments.length > 0) {
				n = Number(arguments[1]);
				if (n != n) { // shortcut for verifying if it's NaN
					n = 0;
				} else if (n != 0 && n != Infinity && n != -Infinity) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}
	 
			if (n >= len) {
				return -1;
			}
	 
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
	 
			for (; k < len; k++) {
				if (k in t && t[k] === searchElement) {
					return k;
				}
			}
			return -1;
		};
	}

	var sh = new ActiveXObject("WScript.Shell")
		, env = sh.Environment(REGIST_ENV_TYPE)
		, cwd = WScript.ScriptFullName.replace(/\\[^\\]+$/,'')
		, delim = ";";
	if (!cwd) return;

	var home = env.Item("HOME")
		, profile = sh.ExpandEnvironmentStrings("%USERPROFILE%");
	var add_paths = [
		"%HOME%/.windows/bin"
		, "%HOME%/.windows/usr/bin"
		, "%HOME%/.windows/usr/dll"
		, "%HOME%/.windows/usr/local/bin"
		, "%HOME%/.windows/usr/local/dll"
		, "%HOME%/.windows/lib/nodist/bin"
		, "%HOME%/.windows/lib/pik"
		, "%HOME%/.windows/lib/pik/ruby/bin"
	];

	var path = env.Item("PATH")
		, expanded_paths = (sh.ExpandEnvironmentStrings("%PATH%") + "").split(delim)
		, i, l
		, bin, is_changed = false;
	for (i = 0, l = add_paths.length; i<l ; i++) {
		bin = add_paths[i].replace(/\//g, '\\');

		//if (!path.match(new RegExp(bin.replace(/\\/g,'\\\\'), "i") ) ){
		if (expanded_paths.indexOf( sh.ExpandEnvironmentStrings(bin) + "" ) == -1) {
			path = bin + delim + path;
			is_changed = true;
		}
	}
	if (is_changed) {
		env.Item("PATH") = path;
	}
})();
