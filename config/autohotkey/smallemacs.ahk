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
SENBSendKey(key) {
	if (IsEnabledSESendKey()) {
		if (GetKeyState("Shift") == 1) {
		MsgBox, OK
		}
		GetKeyState, state, Shift
		if (state != "D") GetKeyState, state, Alt
		if (state != "D") GetKeyState, state, LWin
		if (state != "D") GetKeyState, state, RWin
		if (state == "D") {
			; Send {Blind}%key%
			Send {Blind}%A_ThisHotkey%
		} else {
			Send %key%
		}
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

^m::SENBSendKey("{Enter}")

^f::SENBSendKey("{Right}")
^b::SENBSendKey("{Left}")
^p::SENBSendKey("{Up}")
^n::SENBSendKey("{Down}")
^e::SENBSendKey("{End}")
^a::SENBSendKey("{Home}")

^h::SENBSendKey("{BS}")
^w::SESendKey("^{BS}")
^d::SENBSendKey("{Del}")
