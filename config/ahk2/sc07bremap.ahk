; vim: set sw=4 sts=4 ts=4 tw=0 noet ai:
; #InstallKeybdHook
SendKeyTerminal(nmap, tmaps*) {
	len := tmaps.length ; tmaps.MaxIndex()
	if WinActive("ahk_group Terminal") {
		if (len > 0 && tmaps[1] != "") {
			k := tmaps[1]
			Send(k)
			return
		}
	}
	Send(nmap)
}
SendKeyIfWebBrowser(nmap, tmaps*) {
	if WinActive("ahk_group WebBrowser") {
		Send(nmap)
	}
	; len := tmaps.MaxIndex()
	len := tmaps.length ; tmaps.MaxIndex()
	if (len > 0 && tmaps[1] != "") {
		k := tmaps[1]
		Send(k)
		return
	}
}


sc07B & Space::Send("{Ctrl Down}{Alt Down}{Space}{Alt up}{Ctrl up}")
sc07B & Escape::Send("+^{Escape}")
; sc07B & Delete::Send ^!{Delete}
; sc07B & Delete::Send {Ctrl Down}{Alt Down}{Delete}{Alt up}{Ctrl up}
sc07B & a::SendKeyTerminal("{Blind}^a")
sc07B & b::SendKeyTerminal("{Blind}^b")
sc07B & c::SendKeyTerminal("{Blind}^c")
sc07B & d::SendKeyTerminal("{Blind}^d")
sc07B & e::SendKeyTerminal("{Blind}^e")
sc07B & f::SendKeyTerminal("{Blind}^f")
sc07B & h::SendKeyTerminal("{Blind}^h")
sc07B & i::SendKeyTerminal("{Blind}^i")
sc07B & j::SendKeyTerminal("{Blind}^j")
sc07B & k::SendKeyTerminal("{Blind}^k")
sc07B & l::SendKeyTerminal("{Blind}^l")
sc07B & m::SendKeyTerminal("{Blind}^m")
sc07B & n::SendKeyTerminal("{Blind}^n")
sc07B & o::SendKeyTerminal("{Blind}^o")
sc07B & p::SendKeyTerminal("{Blind}^p")
sc07B & s::SendKeyTerminal("{Blind}^s")
sc07B & t::SendKeyTerminal("{Blind}^t")
sc07B & u::SendKeyTerminal("{Blind}^u")
sc07B & v::SendKeyTerminal("{Blind}^v")
sc07B & w::SendKeyTerminal("{Blind}^w")
sc07B & x::SendKeyTerminal("{Blind}^x")
sc07B & y::SendKeyTerminal("{Blind}^y")
sc07B & z::SendKeyTerminal("{Blind}^z")
sc07B & 0::SendKeyTerminal("{Blind}^0")
sc07B & 1::SendKeyTerminal("{Blind}^1")
sc07B & 2::SendKeyTerminal("{Blind}^2")
sc07B & 3::SendKeyTerminal("{Blind}^3")
sc07B & 4::SendKeyTerminal("{Blind}^4")
sc07B & 5::SendKeyTerminal("{Blind}^5")
sc07B & 6::SendKeyTerminal("{Blind}^6")
sc07B & 7::SendKeyTerminal("{Blind}^7")
sc07B & 8::SendKeyTerminal("{Blind}^8")
sc07B & 9::SendKeyTerminal("{Blind}^9")

sc07B & r::SendKeyIfWebBrowser("{Blind}{F5}", "{Blind}^r")
sc07B & g::SendKeyIfWebBrowser("{Blind}{F3}", "{Blind}^g")
sc07B & q::SendKeyIfWebBrowser("{Blind}!{F4}", "{Blind}^q")

; how to scape ` and ; ?
sc07B & `;::Send("{Blind}^`;")
sc07B & SC028::Send("{Blind}^:")
sc07B & '::Send("{Blind}^'")
sc07B & ,::Send("{Blind}^,")
sc07B & .::Send("{Blind}^.")
sc07B & /::Send("{Blind}^/")
sc07B & -::Send("{Blind}^-")
sc07B & =::Send("{Blind}^=")

; sc07B & {::Send +^{Tab}
; sc07B & }::Send ^{Tab}
; sc07B & [::Send {Blind}^[
sc07B & [::{
	state := GetKeyState("Shift") ? "D" : "U"
	if (state == "D" ) {
		; Send ^{Tab}
		Send("^{PgUp}")
	} else {
		Send("{Escape}")
	}
	return
}

sc07B & ]::{
	state := GetKeyState("Shift") ? "D" : "U"
	if (state == "D") {
		; Send ^{Tab}
		Send("^{PgDn}")
	} else {
		Send("{Blind}^]")
	}
	return
}

sc07B & @::SendKeyTerminal("{Blind}^@")
sc07B & \::SendKeyTerminal("{Blind}^\\")
; sc07B & `;::SendKeyTerminal("{Blind}^`;")
; sc07B & `:::SendKeyTerminal("{Blind}^`:")

sc07B & Tab::Send("{Blind}^{Tab}`"")
sc07B & F1::Send("{Blind}^{F1}")
sc07B & F2::Send("{Blind}^{F2}")
sc07B & F3::Send("{Blind}^{F3}")
sc07B & F4::Send("{Blind}^{F4}")
sc07B & F5::Send("{Blind}^{F5}")
sc07B & F6::Send("{Blind}^{F6}")
sc07B & F7::Send("{Blind}^{F7}")
sc07B & F8::Send("{Blind}^{F8}")
sc07B & F9::Send("{Blind}^{F9}")
sc07B & F10::Send("{Blind}^{F10}")
sc07B & F11::Send("{Blind}^{F11}")
sc07B & F12::Send("{Blind}^{F12}")

; sc07B & Home::Send +^{Home}
sc07B & Home::Send("{Blind}^{Home}")
sc07B & End::Send("{Blind}^{End}")
sc07B & PgUp::Send("{Blind}^{PgUp}")
sc07B & PgDn::Send("{Blind}^{PgDn}")
sc07B & Up::Send("{Blind}^{Up}")
sc07B & Left::Send("{Blind}^{Left}")
sc07B & Right::Send("{Blind}^{Right}")
sc07B & Down::Send("{Blind}^{Down}")

sc07B & LButton::Send("{Blind}^{LButton}")
sc07B & RButton::Send("{Blind}^{RButton}")
sc07B & MButton::Send("{Blind}^{MButton}")
sc07B & WheelDown::Send("{Blind}^{WheelDown}")
sc07B & WheelUp::Send("{Blind}^{WheelUp}")
sc07B & WheelLeft::Send("{Blind}^{WheelLeft}")
sc07B & WheelRight::Send("{Blind}^{WheelRight}")

return
