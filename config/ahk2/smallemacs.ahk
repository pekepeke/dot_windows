; vim: set sw=4 sts=4 ts=4 tw=0 noet ai:
#Include "%A_ScriptDir%"
#UseHook
global _IsDisabledSESendKey := 0
AutoHideTooltip(Txt, Time, X:="", Y:="") {
	ToolTip(Txt, X, Y)
	SetTimer(AutoHide,-%Time%)
	Return
	AutoHide()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		ToolTip()
	Return
} ; V1toV2: Added bracket in the end
}

IsEnabledSESendKey(type := 0) {
	global
	if (WinActive("ahk_group RawInput") || WinActive("ahk_group Terminal") || _IsDisabledSESendKey) {
		return 0
	}
	if (type == 0 && WinActive("ahk_group VimIDE")) {
		return 0
	}
	return 1
}

SESendKey(key, type := 0) {
	if (IsEnabledSESendKey(type)) {
		Send("{Blind}" key)
	} else {
		Send("{Blind}" A_ThisHotkey)
	}
	Return
}

SENBSendKey(key, type := 0) {
	if (IsEnabledSESendKey(type)) {
		if (GetKeyState("Shift") == 1) {
			MsgBox("OK")
		}
		state := GetKeyState("Shift")
		if (state != "D") state := GetKeyState("Alt")
		if (state != "D") state := GetKeyState("LWin")
		if (state != "D") state := GetKeyState("RWin")
		if (state == "D") {
			; Send {Blind}%key%
			Send("{Blind}" A_ThisHotkey)
		} else {
			Send(key)
		}
	} else {
		Send("{Blind}" A_ThisHotkey)
	}
	Return
}

SESendKeyToggle() {
	global
	if (_IsDisabledSESendKey) {
		_IsDisabledSESendKey := 0
		AutoHideTooltip("SESendKey Enable", 3000)
	} else {
		_IsDisabledSESendKey := 1
		AutoHideTooltip("SESendKey Disable", 3000)
	}
	
}

#!Enter::SESendKeyToggle()

^p::SENBSendKey("{Up}", 1)
^n::SENBSendKey("{Down}", 1)

^m::SENBSendKey("{Enter}")

^f::SENBSendKey("{Right}")
^b::SENBSendKey("{Left}")
^e::SENBSendKey("{End}")
^a::SENBSendKey("{Home}")

^h::SENBSendKey("{BS}")
^w::SENBSendKey("^{BS}")
^d::SENBSendKey("{Del}")
