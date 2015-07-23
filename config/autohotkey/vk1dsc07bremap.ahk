; vim: set sw=4 sts=4 ts=4 tw=0 noet ai:
; #InstallKeybdHook
SendKeyTerminal(nmap, tmaps*) {
	len := tmaps.MaxIndex()
	if WinActive("ahk_group Terminal") {
		if (len > 0 && tmaps[1] != "") {
			k := tmaps[1]
			Send %k%
			return
		}
	}
	Send %nmap%
}
SendKeyIfWebBrowser(nmap, tmaps*) {
	if WinActive("ahk_group WebBrowser") {
		Send %nmap%
	}
	len := tmaps.MaxIndex()
	if (len > 0 && tmaps[1] != "") {
		k := tmaps[1]
		Send %k%
		return
	}
}


vk1dsc07b & Space::Send {Ctrl Down}{Alt Down}{Space}{Alt up}{Ctrl up}
vk1dsc07b & Escape::Send +^{Escape}
; vk1dsc07b & Delete::Send ^!{Delete}
; vk1dsc07b & Delete::Send {Ctrl Down}{Alt Down}{Delete}{Alt up}{Ctrl up}
vk1dsc07b & a::SendKeyTerminal("{Blind}^a")
vk1dsc07b & b::SendKeyTerminal("{Blind}^b")
vk1dsc07b & c::SendKeyTerminal("{Blind}^c")
vk1dsc07b & d::SendKeyTerminal("{Blind}^d")
vk1dsc07b & e::SendKeyTerminal("{Blind}^e")
vk1dsc07b & f::SendKeyTerminal("{Blind}^f")
vk1dsc07b & h::SendKeyTerminal("{Blind}^h")
vk1dsc07b & i::SendKeyTerminal("{Blind}^i")
vk1dsc07b & j::SendKeyTerminal("{Blind}^j")
vk1dsc07b & k::SendKeyTerminal("{Blind}^k")
vk1dsc07b & l::SendKeyTerminal("{Blind}^l")
vk1dsc07b & m::SendKeyTerminal("{Blind}^m")
vk1dsc07b & n::SendKeyTerminal("{Blind}^n")
vk1dsc07b & o::SendKeyTerminal("{Blind}^o")
vk1dsc07b & p::SendKeyTerminal("{Blind}^p")
vk1dsc07b & s::SendKeyTerminal("{Blind}^s")
vk1dsc07b & t::SendKeyTerminal("{Blind}^t")
vk1dsc07b & u::SendKeyTerminal("{Blind}^u")
vk1dsc07b & v::SendKeyTerminal("{Blind}^v")
vk1dsc07b & w::SendKeyTerminal("{Blind}^w")
vk1dsc07b & x::SendKeyTerminal("{Blind}^x")
vk1dsc07b & y::SendKeyTerminal("{Blind}^y")
vk1dsc07b & z::SendKeyTerminal("{Blind}^z")
vk1dsc07b & 0::SendKeyTerminal("{Blind}^0")
vk1dsc07b & 1::SendKeyTerminal("{Blind}^1")
vk1dsc07b & 2::SendKeyTerminal("{Blind}^2")
vk1dsc07b & 3::SendKeyTerminal("{Blind}^3")
vk1dsc07b & 4::SendKeyTerminal("{Blind}^4")
vk1dsc07b & 5::SendKeyTerminal("{Blind}^5")
vk1dsc07b & 6::SendKeyTerminal("{Blind}^6")
vk1dsc07b & 7::SendKeyTerminal("{Blind}^7")
vk1dsc07b & 8::SendKeyTerminal("{Blind}^8")
vk1dsc07b & 9::SendKeyTerminal("{Blind}^9")

vk1dsc07b & r::SendKeyIfWebBrowser("{Blind}{F5}", "{Blind}^r")
vk1dsc07b & g::SendKeyIfWebBrowser("{Blind}{F3}", "{Blind}^g")
vk1dsc07b & q::SendKeyIfWebBrowser("{Blind}!{F4}", "{Blind}^q")

; how to scape ` and ; ?
vk1dsc07b & `;::Send {Blind}^`;
vk1dsc07b & SC028::Send {Blind}^:
vk1dsc07b & '::Send {Blind}^'
vk1dsc07b & ,::Send {Blind}^,
vk1dsc07b & .::Send {Blind}^.
vk1dsc07b & /::Send {Blind}^/
vk1dsc07b & -::Send {Blind}^-
vk1dsc07b & =::Send {Blind}^=

; vk1dsc07b & {::Send +^{Tab}
; vk1dsc07b & }::Send ^{Tab}
; vk1dsc07b & [::Send {Blind}^[
vk1dsc07b & [::
	GetKeyState, state, Shift
	if (state == "D" ) {
		; Send ^{Tab}
		Send ^{PgUp}
	} else {
		Send {Escape}
	}
	return

vk1dsc07b & ]::
	GetKeyState, state, Shift
	if (state == "D") {
		; Send ^{Tab}
		Send ^{PgDn}
	} else {
		Send {Blind}^]
	}
	return

vk1dsc07b & @::SendKeyTerminal("{Blind}^@")
vk1dsc07b & \::SendKeyTerminal("{Blind}^\\")
; vk1dsc07b & `;::SendKeyTerminal("{Blind}^`;")
; vk1dsc07b & `:::SendKeyTerminal("{Blind}^`:")

vk1dsc07b & Tab::Send {Blind}^{Tab}"
vk1dsc07b & F1::Send {Blind}^{F1}
vk1dsc07b & F2::Send {Blind}^{F2}
vk1dsc07b & F3::Send {Blind}^{F3}
vk1dsc07b & F4::Send {Blind}^{F4}
vk1dsc07b & F5::Send {Blind}^{F5}
vk1dsc07b & F6::Send {Blind}^{F6}
vk1dsc07b & F7::Send {Blind}^{F7}
vk1dsc07b & F8::Send {Blind}^{F8}
vk1dsc07b & F9::Send {Blind}^{F9}
vk1dsc07b & F10::Send {Blind}^{F10}
vk1dsc07b & F11::Send {Blind}^{F11}
vk1dsc07b & F12::Send {Blind}^{F12}

; vk1dsc07b & Home::Send +^{Home}
vk1dsc07b & Home::Send {Blind}^{Home}
vk1dsc07b & End::Send {Blind}^{End}
vk1dsc07b & PgUp::Send {Blind}^{PgUp}
vk1dsc07b & PgDn::Send {Blind}^{PgDn}
vk1dsc07b & Up::Send {Blind}^{Up}
vk1dsc07b & Left::Send {Blind}^{Left}
vk1dsc07b & Right::Send {Blind}^{Right}
vk1dsc07b & Down::Send {Blind}^{Down}

vk1Dsc07B & LButton::Send {Blind}^{LButton}
vk1Dsc07B & RButton::Send {Blind}^{RButton}
vk1Dsc07B & MButton::Send {Blind}^{MButton}
vk1Dsc07B & WheelDown::Send {Blind}^{WheelDown}
vk1Dsc07B & WheelUp::Send {Blind}^{WheelUp}
vk1Dsc07B & WheelLeft::Send {Blind}^{WheelLeft}
vk1Dsc07B & WheelRight::Send {Blind}^{WheelRight}

return
