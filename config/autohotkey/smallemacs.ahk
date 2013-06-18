; vim: set sw=4 sts=4 ts=4 tw=0 noet ai:
#Include %A_ScriptDir%
#UseHook

AutoHideTooltip(Txt, Time, X="", Y="") {
  Tooltip, %Txt%, %X%, %Y%
  SetTimer, AutoHide, -%Time%
  Return
  AutoHide:
    Tooltip, 
  Return
}

IsEnabledSmallEmacsSendKey() {
	global
	IfWinActive,ahk_class Vim
		return 0
	IfWinActive,ahk_class Emacs ;NTEmacs
		Return 1  
	IfWinActive,ahk_class XEmacs ;Cygwinè„ÇÃXEmacs
		Return 1
	if (is_my_sendkey) {
		return 0
	}
	return 1
}
SmallEmacsSendKey(key) {
	if (IsEnabledSmallEmacsSendKey()) {
		Send %key%
	} else {
		Send %A_ThisHotkey%
	}
	Return
}

SmallEmacsSendKeyToggle() {
	global
	if (is_my_sendkey) {
		is_my_sendkey = 0
		AutoHideTooltip("SmallEmacsSendKey Enable", 3000)
	} else {
		is_my_sendkey = 1
		AutoHideTooltip("SmallEmacsSendKey Disable", 3000)
	}
	
}

#!Enter::SmallEmacsSendKeyToggle()

^h::SmallEmacsSendKey("{BS}")
^m::SmallEmacsSendKey("{Enter}")

^p::SmallEmacsSendKey("{Up}")
^n::SmallEmacsSendKey("{Down}")
^e::SmallEmacsSendKey("{End}")
^a::SmallEmacsSendKey("{Home}")

