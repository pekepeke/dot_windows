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

IsEnabledSESendKey() {
	global
	if (WinActive("ahk_group RawInput") || WinActive("ahk_group Terminal") || _IsDisabledSESendKey) {
		return 0
	}
	return 1
}
SESendKey(key) {
	if (IsEnabledSESendKey()) {
		Send {Blind}%key%
	} else {
		Send {Blind}%A_ThisHotkey%
	}
	Return
}
SENCSendKey(key) {
	if (IsEnabledSESendKey()) {
		Send {Ctrl up}
		Send {Blind}%key%
	} else {
		Send {Blind}%A_ThisHotkey%
	}
	Return
}
SENBSendKey(key) {
	if (IsEnabledSESendKey()) {
		Send %key%
	} else {
		Send {Blind}%A_ThisHotkey%
	}
	Return
}

SESendKeyToggle() {
	global
	if (_IsDisabledSESendKey) {
		_IsDisabledSESendKey = 0
		AutoHideTooltip("SESendKey Enable", 3000)
	} else {
		_IsDisabledSESendKey = 1
		AutoHideTooltip("SESendKey Disable", 3000)
	}
	
}

#!Enter::SESendKeyToggle()

^m::SENCSendKey("{Enter}")

^f::SENCSendKey("{Right}")
^b::SENCSendKey("{Left}")
^p::SENCSendKey("{Up}")
^n::SENCSendKey("{Down}")
^e::SENCSendKey("{End}")
^a::SENCSendKey("{Home}")

^h::SENCSendKey("{BS}")
^w::SESendKey("^{BS}")
^d::SENCSendKey("{Del}")
