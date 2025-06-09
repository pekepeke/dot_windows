;CapsLock -> Ctrl
;Capslock::Ctrl
;sc03a::Ctrl

GroupAdd("Terminal", "ahk_class CASCADIA_HOSTING_WINDOW_CLASS")
GroupAdd("Terminal", "ahk_class Putty")
GroupAdd("Terminal", "ahk_class ConsoleWindowClass") ; Cygwin
GroupAdd("Terminal", "ahk_class cygwin/x")
GroupAdd("Terminal", "ahk_class Xming X")
GroupAdd("Terminal", "ahk_class mintty")
GroupAdd("Terminal", "ahk_class VirtualConsoleClass") ; ConEmu
GroupAdd("Terminal", "ahk_class RAIL_WINDOW") ; WSL

GroupAdd("WebBrowser", "ahk_class IEFrame")
GroupAdd("WebBrowser", "ahk_class MozillaWindowClass")
GroupAdd("WebBrowser", "ahk_class IEFrame")
GroupAdd("WebBrowser", "ahk_class Chrome_WidgetWin_1")
;GroupAdd("WebBrowser", "ahk_exe chrome.exe")
;GroupAdd("WebBrowser", "ahk_exe vivaldi.exe")

GroupAdd("RawInput", "ahk_class Vim")
GroupAdd("RawInput", "ahk_class Emacs")
GroupAdd("RawInput", "ahk_class XEmacs")
GroupAdd("RawInput", "ahk_class MEADOW")
;GroupAdd("RawInput", "ahk_exe sakura.exe")

GroupAdd("VimIDE", "ahk_exe PhpStorm64.exe")
GroupAdd("VimIDE", "ahk_exe PhpStorm32.exe")
GroupAdd("VimIDE", "ahk_exe Code.exe")
; GroupAdd RawInput, ahk_class SunAwtFrame

#Include "ime_func.ahk"
#Include "smallemacs.ahk"
#Include "sc07Bremap.ahk"

;; vi like
!h::Send("{Left}")
!l::Send("{Right}")
!j::Send("{Down}")
!k::Send("{Up}")

!+h::Send("+{Left}")
!+l::Send("+{Right}")
!+j::Send("+{Down}")
!+k::Send("+{Up}")

; Henkan(vk1Csc079->sc079)
sc079::{
  IME_ON("A")
  IME_SetConvMode("A" , 25)
  IME_SetSentenceMode("A" , "8")
return
}


; Muhenkan(vk1Dsc07B->sc07B)
sc07B::IME_OFF("A")

; --------------------------------------------------
; Window Move
WinMoveStep(XD,YD) {
	win_id := WinGetID("A")
	WinGetPos(&x, &y, , , "ahk_id " win_id)
	Step := 24
	x := x + (XD * Step)
	y := y + (YD * Step)
	WinMove(x, y, , , "ahk_id " win_id)
	return
}
#Left::WinMoveStep(-1,0)
#Right::WinMoveStep(1,0)
#Up::WinMoveStep(0,-1)
#Down::WinMoveStep(0,1)

; --------------------------------------------------
; Window Size
WinSizeStep(XD,YD) {
	win_id := WinGetID("A")
	WinGetPos(, , &w, &h, "ahk_id " win_id)
	Step := 24
	w := w + (XD * Step)
	h := h + (YD * Step)
	WinMove(, , w, h, "ahk_id " win_id)
	return
}
+#Left::WinSizeStep(-1,0)
+#Right::WinSizeStep(1,0)
+#Up::WinSizeStep(0,-1)
+#Down::WinSizeStep(0,1)

; --- cmd.exe paste
#HotIf WinActive("ahk_class ConsoleWindowClass", )
  ^v::  Send("!{Space}ep")
#HotIf
