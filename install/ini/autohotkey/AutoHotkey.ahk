;CapsLockキーにCtrlキーの仕事をさせる
;Capslock::Ctrl
;sc03a::Ctrl

#include ime_func.ahk
#include smallemacs.ahk

;; vi like
!h::Send, {Left}
!l::Send, {Right}
!j::Send, {Down}
!k::Send, {Up}

!+h::Send, +{Left}
!+l::Send, +{Right}
!+j::Send, +{Down}
!+k::Send, +{Up}

;変換
vk1Csc079::
  IME_ON("A")
  IME_SetConvMode("A" , 25)
  IME_SetSentenceMode("A" , "8")
return

;無変換
vk1Dsc07B::IME_OFF("A")

; --------------------------------------------------
; Window Move
WinMoveStep(XD,YD) {
	WinGet,win_id,ID,A
	WinGetPos,x,y,,,ahk_id %win_id%
	Step := 24
	x := x + (XD * Step)
	y := y + (YD * Step)
	WinMove,ahk_id %win_id%,,%x%,%y%
	return
}
#Left::WinMoveStep(-1,0)
#Right::WinMoveStep(1,0)
#Up::WinMoveStep(0,-1)
#Down::WinMoveStep(0,1)

; --------------------------------------------------
; Window Size
WinSizeStep(XD,YD) {
	WinGet,win_id,ID,A
	WinGetPos,,,w,h,ahk_id %win_id%
	Step := 24
	w := w + (XD * Step)
	h := h + (YD * Step)
	WinMove,ahk_id %win_id%,,,,%w%,%h%
	return
}
+#Left::WinSizeStep(-1,0)
+#Right::WinSizeStep(1,0)
+#Up::WinSizeStep(0,-1)
+#Down::WinSizeStep(0,1)

; --- cmd.exe paste
#IfWinActive ahk_class ConsoleWindowClass
  ^v::Send,!{Space}ep
#IfWinActive
