; vim: set sw=4 sts=4 ts=4 tw=0 noet ai:
#Include "%A_ScriptDir%"
#Include "IME.ahk"


;初期値
;####################################################################

; ※ #if に使用できるのは英字のみ？ blankは判定不能

;0 (VIモード無効)
;1 normal
;2 insert
;3 Number
;4 Command
;5 Command line
;6 Search
;7 Replace
vimode := "0"

;0:通常（選択モードではない）
;1:文字選択モード  2:行選択モード  3:矩形選択モード(対応アプリのみ)
visualmode := "0"

;カットバッファ内が行単位の場合に、1
yankmode := "0"

;[vimode=4]
;0 -
;1 delete
;2 yank
;3 g   gg(ファイル先頭)
;4 c   change
;5 r   replace
;(以下実装方法未定※何エディタを想定？メモ帳,eclipse,sakura,hidemaru等？)
;6 m   bookmark 
;7 '   bookmark
;8 f   検索
;9 F   前方検索
;10 q   macro
;11 @   macro
command := "0"

n_count := ""
commandline := ""
ex_commandline := ""

;"/" or  "?"
searchmode := ""
searchword := ""


;####################################################################
;有効/無効 トグル
;####################################################################
#HotIf !WinActive("ahk_class Vim", )
;vimode on/off
^]:: 
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (vimode = 0)
	{
		vimode := "1"
		mode_end()
		SetTimer(draw_tooltip,100)
	}
	else
	{
		mode_end()
		vimode := "0"
		SetTimer(draw_tooltip,0)
		ToolTip()
	}
	return
} ; V1toV2: Added bracket in the end
#HotIf !WinActive(, )

;vi系のウィンドウでは無効化のみ
#HotIf WinActive("ahk_class Vim", )
^]:: 
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	vimode := "0"
	SetTimer(draw_tooltip,0)
	ToolTip()
	return
} ; V1toV2: Added bracket in the end
#HotIf !WinActive(, )

;####################################################################
;状態描画
;####################################################################
draw_tooltip()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	title := WinGetTitle("A")
WinGetPos(&myX, &myY, &myWide, &myHigh, "A")
	myWide := "10" ;固定位置
	myHigh -= 20

	;MouseGetPos, myWide, myHigh
	;myWide+=10
	;myHigh+=5

	if (vimode = 0)
		;tooltip,novimode, %myWide%,%myHigh%
		ToolTip()
		else if (vimode = 1)
	{
		if (visualmode = 0)
			ToolTip("vimode", myWide, myHigh)
				else if (visualmode = 1)
			ToolTip("vimode[-visual-]", myWide, myHigh)
				else if (visualmode = 2)
			ToolTip("vimode[-visual line-]", myWide, myHigh)
				else if (visualmode = 3)
			ToolTip("vimode[-visual box-]", myWide, myHigh)
	}
		else if (vimode = 2)
		ToolTip("vimode[-insert-]", myWide, myHigh)
		else if (vimode = 3)
		ToolTip("vimode[" n_count "]", myWide, myHigh)
		else if (vimode = 31) ;replace用
		ToolTip("vimode[" n_count "" commandline "]", myWide, myHigh)
		else if (vimode = 4)
		ToolTip("vimode[" commandline "" n_count "]", myWide, myHigh)
		else if (vimode = 5)
		ToolTip("vimode[:]", myWide, myHigh)
		else if (vimode = 6)
		ToolTip("vimode[" searchmode "" searchword "]", myWide, myHigh)
		else if (vimode = 7)
		ToolTip("vimode[-replace-]", myWide, myHigh)
	else
		MsgBox("error(" vimode ")")
	return
	
;####################################################################
;通常モード
;####################################################################
#HotIf ( vimode=1 )
} ; V1toV2: Added Bracket before hotkey or Hotstring
	ESC::
	^[::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		input_escape()
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	Enter::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("{down}")
		return

	;################################
	;カーソル移動系
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	h::	move_h()
	j::	move_j()
	k::	move_k()
	l::	move_l()
	w::	move_w()
	e::	move_e()
	b::	move_b()
	0::	move_0()
	$::	move__()
	^::	move___2()
	+::	move___3()
	-::	move___4()
	^f::	move__f()
	^b::	move__b()

	+G::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 0)
			Send("^{End}")
		else
			Send("+^{End}")
		return

	;センテンス移動は難しいのでエクセル等で便利なCtrl上下を設定しておく
} ; V1toV2: Added Bracket before hotkey or Hotstring
	(::	Send("^{UP}")
	)::	Send("^{Down}")

	;################################
	;行結合
	;################################
	+j::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("{End}")
		Send("{End}")
		Send("{Delete}")
		return


	;################################
	;undo/redo
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	u::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("^z")
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	^r::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("^y")

	;################################
	;挿入モード移行
	;################################
	;カーソル位置に挿入
} ; V1toV2: Added Bracket before hotkey or Hotstring
	i::	insert_start()

	;行頭に挿入
	+i::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 1)
			return
		Send("{Home}")
		insert_start()
		return

	;カーソル位置の右に追加
} ; V1toV2: Added Bracket before hotkey or Hotstring
	a::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 1)
			return

		if WinActive("ahk_class XLMAIN")
		{
			temp := ControlGetClassNN(ControlGetFocus())
			if (temp = "EXCEL61")
			{
				Send("{Right}")
			}
			insert_start()
			return
		}
		Send("{Right}")
		insert_start()
		return

	;行末尾に追加
} ; V1toV2: Added Bracket before hotkey or Hotstring
	+a::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 1)
			return
		Send("{end}")
		insert_start()
		return

	;1行追加
} ; V1toV2: Added Bracket before hotkey or Hotstring
	o::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 1)
			return
		Send("{end}")
		Send("{end}")
		input_enter()
		insert_start()
		return

	;1行挿入
} ; V1toV2: Added Bracket before hotkey or Hotstring
	+o::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 1)
			return
		Send("{Home}")
		Send("{Home}")
		input_enter()
		Send("{Up}")
		insert_start()
		return

	;1文字変更
} ; V1toV2: Added Bracket before hotkey or Hotstring
	s::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("{Delete}")
		insert_start()
		return

	;1行変更
} ; V1toV2: Added Bracket before hotkey or Hotstring
	+s::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("{Home}")
		Send("+{End}")
		Send("{Delete}")
		insert_start()
		return

	;行末まで変更
} ; V1toV2: Added Bracket before hotkey or Hotstring
	+c::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("+{End}")
		Send("{Delete}")
		insert_start()
		return

	;################################
	;変更モード
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	r::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if WinActive("ahk_class XLMAIN")
		{
			temp := ControlGetClassNN(ControlGetFocus())
			if (temp != "EXCEL61")
			{
				Send("{F2}")
				Send("^{Home}")
				return
			}
		}

		vimode := "4"	;ツールチップ表示用にコマンドモードへ変更
		command := "5"	;#ifで他のマップに判定されないように
					;（他のマップに判定されると、inputよりもホットキーの方が優先される）
		commandline := "r"
		ihtemp := InputHook("'B C L1'","{ESC}"), ihtemp.Start(), ErrorLevel := ihtemp.Wait(), temp := ihtemp.Input
		;msgbox,%ErrorLevel%
		if (ErrorLevel = "Max")
		{
			Send("+{Right}")
			Send("{" temp "}")
			Send("{Left}")
		}
		mode_end()
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	+r::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		vimode := "7"
		Send("{insert}")
		return


	;################################
	;visualモード（範囲選択開始）
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	v:: 
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 1)
		{
			visualmode := "0"
			select_cancel()
		}
		else 
		{
			visualmode := "1"
			;デフォルトで1文字選択
			Send("+{Right}")
		}
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	+v::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 2)
			visualmode := "0"
		else
		{
			visualmode := "2"
			Send("{Home}")
			Send("+{Down}")
		}
		return

	;^v::visualmode=3
	


	;################################
	;コマンド開始
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	d::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		vimode := "4"
		command := "1"

		commandline := "d"
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	y::
		;通常モード
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 0)
		{
			;ヤンク開始
			vimode := "4"
			command := "2"
			commandline := "y"
		}
		;文字選択中
		if (visualmode = 1)
		{
			Send("^c")
			select_cancel()
			yankmode := "0"
		}
		;行選択中
		if (visualmode = 2)
		{
			Send("^c")
			select_cancel()
			Send("{Home}")
			yankmode := "1"
		}
		visualmode := "0"
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	g::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		vimode := "4"
		command := "3"
		commandline := "g"
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	c::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode != 0)
		{
			Send("{Delete}")
			insert_start()
		}
		vimode := "4"
		command := "4"
		commandline := "c"
		return
		return
	
	;################################
	;クリップボード操作
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	x::
		;エクセルのセル外の場合、内容をコピーしてから内容削除
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if WinActive("ahk_class XLMAIN")
		{
			temp := ControlGetClassNN(ControlGetFocus())
			if (temp != "EXCEL61")
			{
				Send("{F2}")
				Send("^{home}")
				Send("+^{End}")
} ; V1toV2: Added bracket before function
				Send("^c")
				;Send,{F2}	;F2だとセル編集が終了していない様に見える
				Send("{ESC}")
				Send("{Delete}")
				return
			}
		}
		if (visualmode = 0)
			Send("+{Right}")
		Send("^x")
		return

	+x::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 0)
			Send("+{Left}")
		Send("^x")
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring
	
	+d::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 0)
			Send("+{End}")
		else
		{
			Send("{Home}")
			Send("+{End}")
		}
		Send("^x")
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring
	
	p::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (yankmode = 0)
		{
			Send("{Right}")
			Send("^v")
			Send("{Left}")
		}
				else if (yankmode = 1)
		{
			Send("{Home}")
			Send("{Home}")
			Send("{Down}")
			Send("^v")
			Send("{Up}")
		}
				else if (yankmode = "excelline")
		{
			Send("{Down}")
			Send("+{Space}")
			Send("+{F10}")
			Send("e")
		}
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	+p::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (yankmode = 0)
		{
			Send("^v")
			Send("{Left}")
		}
				else if (yankmode = 1)
		{
			Send("{Home}")
			Send("{Home}")
			Send("^v")
			Send("{Up}")
		}
				else if (yankmode = "excelline")
		{
			Send("+{Space}")
			Send("+{F10}")
			Send("e")
		}
		return

	;################################
	;数値指定(開始)※2桁目移行は別途
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		vimode := "3"
		;vimode=4
		;command=0
		n_count := A_ThisHotkey
		return

	;################################
	;コマンドラインモード
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	::: 
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		vimode := "5"	;ツールチップ表示変更と、inputboxに文字が入力できるように。
		IB := InputBox("", "vimode:", "h100"), ex_commandline := IB.Value, ErrorLevel := IB.Result="OK" ? 0 : IB.Result="CANCEL" ? 1 : IB.Result="Timeout" ? 2 : "ERROR"
		vimode := "1"	;通常モードに戻る
		if (ErrorLevel != 0)
			return
		run_command()
} ; V1toV2: Added Bracket before hotkey or Hotstring
	`;::return
		
	;################################
	;検索
	;################################
	/::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("^f")
		Sleep(20)
		insert_start()
		return

	;?::
} ; V1toV2: Added bracket in the end
		
#HotIf

;####################################################################
;挿入モード or 置換モード
;####################################################################
#HotIf ( vimode=2 or vimode=7)

	ESC:: 
	^[:: 
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (vimode = 7)	;repraceの場合は、
		{
			Send("{insert}")	;insertキーを押してエディタのモードを挿入モードに戻す。todo:たまにモードずれが起こる
		}

		;todo imeがオンの場合、入力キャンセルせずにinsertモードが終る or 入力キャンセルしてinsertモードが終る の二択。
		; IME OFF時、インサートモード終了としたい。エクセル上だとセルまで抜ける←対応済み
		input_escape()
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring


	^h::	Send("{BS}")
	^i::	Send("{Tab}")

	^j::
	^m::
	enter::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		input_enter()
		return

	;インデント(カーソル位置が保持できないので使い道が無いかも)
} ; V1toV2: Added Bracket before hotkey or Hotstring
	^t::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("{Home}")
		Send("{Tab}")
		return

	;補完(エディタによる)
	;^n::
	;^p::
} ; V1toV2: Added bracket in the end
#HotIf

;####################################################################
;数字入力以降処理
;####################################################################
#HotIf ( vimode=3 )
	ESC:: 
	^[:: 
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		input_escape()
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	^h::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		len := StrLen(n_count)
		len--
		;MsgBox, %len%
		if (len = 0)
			mode_end()
		else
			n_count := SubStr(n_count, 1, len)
		return

	;################################
	;数値入力
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
	0::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		n_count := n_count . "" . A_ThisHotkey
		return

	;################################
	;カーソル移動
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
	^f::
	^b::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Loop n_count
		{
			move_cursor()
		}
		n_count := ""
		mode_end()
		return

	

	;################################
	;変更
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	s::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Loop n_count
		{
			Send("+{Right}")
		}
		n_count := ""
		Send("^x")
		mode_end()
		insert_start()
		return

	;################################
	;置換
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	r::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		vimode := "31" ;ツールチップ表示、マップ隔離
		commandline := "r"
		ihtemp := InputHook("'B C L1'","{ESC}"), ihtemp.Start(), ErrorLevel := ihtemp.Wait(), temp := ihtemp.Input
		if (ErrorLevel = "Max")
		{
			Loop n_count
			{
				Send("+{Right}")
			}
			Loop n_count
			{
				Send("{" temp "}")
			}
			Send("{Left}")
		}
		n_count := ""
		mode_end()
		return

	;################################
	;削除
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	x::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Loop n_count
		{
			Send("+{Right}")
		}
		n_count := ""
		Send("^x")
		mode_end()
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring
	+x::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Loop n_count
		{
			Send("+{Left}")
		}
		n_count := ""
		Send("^x")
		mode_end()
		return

	;################################
	;指定行ジャンプ
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	g::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if WinActive("ahk_class Hidemaru32Class")
		{
			Send("^g")
			Send(n_count)
			n_count := ""
			Send("{Enter}")
			return
		}
		return
} ; V1toV2: Added bracket in the end

#HotIf


;####################################################################
;delete中
;####################################################################
#HotIf ( vimode=4 and command=1 )
	ESC::
	^[::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		input_escape()
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	d::
		;エクセルのセル内に入るとClassNNが「EXCEL61」になる
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if WinActive("ahk_class XLMAIN")
		{
			temp := ControlGetClassNN(ControlGetFocus())
			if (temp != "EXCEL61")
			{
				yankmode := "excelline"
				Send("+{space}")
				Send("^x")
				mode_end()
				return
			}
		}
		yankmode := "1"
		Send("{Home}")
		Send("+{Down}")
		Send("^x")
		mode_end()
		return

	;################################
	;数値入力
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
	0::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		n_count := n_count . "" . A_ThisHotkey
		return

	;################################
	;範囲削除
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		yankmode := "0"
		visualmode := "1"

		if (n_count = "")
			n_count := "1"
		Loop n_count
		{
			move_cursor()
		}
		n_count := ""

		Send("^x")
		mode_end()
		return
} ; V1toV2: Added bracket in the end
#HotIf

;####################################################################
;yank中
;####################################################################
#HotIf ( vimode=4 and command=2 )
	ESC::
	^[::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		input_escape()
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	y::

		;excelで行選択コピー
		;エクセルのセル内に入るとClassNNが「EXCEL61」になる
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if WinActive("ahk_class XLMAIN")
		{
			temp := ControlGetClassNN(ControlGetFocus())
			if (temp != "EXCEL61")
			{
				yankmode := "excelline"
				Send("+{space}")		;todo日本語入力モードだとおかしくなる(セル内に半角スペース入力)
				Send("^c")
				mode_end()
				return
			}
		}
		yankmode := "1"
		Send("{Home}")
		Send("+{Down}")
		Send("^c")
		Send("{Up}")
		mode_end()
		return

	;################################
	;数値入力
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
	0::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		n_count := n_count . "" . A_ThisHotkey
		return

	;################################
	;範囲コピー
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		yankmode := "0"
		visualmode := "1"

		if (n_count = "")
			n_count := "1"
		Loop n_count
		{
			move_cursor()
		}
		n_count := ""

		Send("^c")
		mode_end()
		return
} ; V1toV2: Added bracket in the end
#HotIf

;####################################################################
;command g gg 
;####################################################################
#HotIf ( vimode=4 and command=3 )
	ESC::
	^[::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		input_escape()
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	g::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 0)
			Send("^{Home}")
		else
			Send("+^{Home}")
		mode_end()
		return
} ; V1toV2: Added bracket in the end
#HotIf

;####################################################################
;command c change
;####################################################################
#HotIf (vimode=4 and command=4 )
	ESC::
	^[::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		input_escape()
		return

	;1行変更(Sと同じ)
} ; V1toV2: Added Bracket before hotkey or Hotstring
	c::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("{Home}")
		Send("+{End}")
		Send("{Delete}")
		insert_start()
		return

	;################################
	;数値入力
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
	0::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		n_count := n_count . "" . A_ThisHotkey
		return
} ; V1toV2: Added Bracket before hotkey or Hotstring

	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		yankmode := "0"
		visualmode := "1"

		if (n_count = "")
			n_count := "1"
		Loop n_count
		{
			move_cursor()
		}
		n_count := ""

		Send("^x")
		mode_end()
		insert_start()
		return
} ; V1toV2: Added bracket in the end
#HotIf


;####################################################################
;カーソル移動系
;####################################################################
move_h()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
		Send("{Left}")
		else if (visualmode = 1)
		Send("+{Left}")
	return
} ; V1toV2: Added Bracket before label

move_j()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
		Send("{Down}")
	else
		Send("+{Down}")
	return
} ; V1toV2: Added Bracket before label

move_k()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
		Send("{Up}")
	else 
		Send("+{Up}")
	return
} ; V1toV2: Added Bracket before label

move_l()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
		Send("{Right}")
		else if (visualmode = 1)
		Send("+{Right}")
	return
} ; V1toV2: Added Bracket before label

move_w()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
		Send("^{Right}")
		else if (visualmode = 1)
		Send("^+{Right}")
	return
} ; V1toV2: Added Bracket before label

move_e()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
	{
		Send("{Right}")
		Send("^{Right}")
		Send("{Left}")
	}
		else if (visualmode = 1)
	{
		Send("+{Right}")
		Send("^+{Right}")
		Send("+{Left}")
	}
	return
} ; V1toV2: Added Bracket before label

move_b()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
		Send("^{Left}")
		else if (visualmode = 1)
		Send("^+{Left}")
	return
} ; V1toV2: Added Bracket before label

move_0()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
		Send("{Home}")
		else if (visualmode = 1)
		Send("+{Home}")
	return
} ; V1toV2: Added Bracket before label

move__()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
		Send("{End}")
		else if (visualmode = 1)
		Send("+{End}")
	return
} ; V1toV2: Added Bracket before label

move___2()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
	{
		Send("{Home}")
		Send("{Home}")
	}
		else if (visualmode = 1)
	{
		Send("+{Home}")
		Send("+{Home}")
	}
	return
} ; V1toV2: Added Bracket before label

move___3()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
	{
		Send("{Home}")
		Send("{Down}")
	}
		else if (visualmode = 1)
	{
		Send("{Home}")
		Send("{Down}")
	}
	return
} ; V1toV2: Added Bracket before label

move___4()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
	{
		Send("{Home}")
		Send("{Up}")
	}
		else if (visualmode = 1)
	{
		Send("+{Home}")
		Send("+{Up}")
	}
	return
} ; V1toV2: Added Bracket before label

move__f()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
		Send("{PgDn}")
	else
		Send("+{PgDn}")
	return
} ; V1toV2: Added Bracket before label

move__b()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (visualmode = 0)
		Send("{PgUp}")
	else
		Send("+{PgUp}")
	return
} ; V1toV2: Added Bracket before label

move_cursor()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (A_ThisHotkey = "h")
		move_h()
		else if (A_ThisHotkey = "j")
		move_j()
		else if (A_ThisHotkey = "k")
		move_k()
		else if (A_ThisHotkey = "l")
		move_l()
		else if (A_ThisHotkey = "w")
		move_w()
		else if (A_ThisHotkey = "e")
		move_e()
		else if (A_ThisHotkey = "b")
		move_b()
		else if (A_ThisHotkey = "+")
		move___3()
		else if (A_ThisHotkey = "-")
		move___4()
		else if (command = 0) ;カット、ヤンク等には頁移動は含まない
	{
		if (A_ThisHotkey = "^f")
			move__f()
				else if (A_ThisHotkey = "^b")
			move__b()
	}
	return

;####################################################################
;通常モード(vimode=1)で呼ばれることは無いはず？
} ; V1toV2: Added bracket before function
input_enter()

	;excel
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if WinActive("ahk_class XLMAIN")
	{					;excelの場合
		temp := ControlGetClassNN(ControlGetFocus())
		if (temp = "EXCEL61")	;セル内
		{
			;Send,!{Enter}
			;todo 日本語の確定がおかしくなる。未確定文字列があれば、確定のみ(enterのみ)。
			;未確定文字列無ければALT-Enterのみ。としたい。
			A_StringCaseSense := true
			if (A_ThisHotkey ~= "^(?i:o|\+o)$")	;暫定対処
			Send("!{Enter}")
			else
				Send("{Enter}")	;日本語確定 or セル確定(現状insertモードのままセルを抜けてしまう)
		}
		else			;セル外
			Send("{enter}")
	}
	else				;excel以外
	{
		Send("{enter}")
	}
	return

;####################################################################
} ; V1toV2: Added bracket before function
input_escape()

	;セルの編集内容が有無を言わせず失われて悲しい思いをしないために
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if WinActive("ahk_class XLMAIN")
	{
		temp := ControlGetClassNN(ControlGetFocus())
		if (temp = "EXCEL61")		;セル内
		{
			if (vimode = 1)		;通常モード
			{
				vimode := "0"	;次のダイアログで、ynが押せるように
				msgResult := MsgBox("セル編集内容を確定しますか？", "vimode", 3)
				vimode := "1"	;モード終了するので必要ないが、一応通常モードに戻しておく

				if (msgResult = "Yes")
					Send("{Enter}")
				if (msgResult = "No")
					Send("{ESC}")
				if (msgResult = "Cancel")	;キャンセルはセル編集モードのまま
					return
			}
			;セル内で通常モード以外の場合は、ESCを発行せずに後続のmode_endを実行
			;(todo:未確定の日本語入力がキャンセルされず挿入モードが終る)
		}
		else				;セル外
			Send("{ESC}")
	}
	else	;エクセル以外
	{	
		if IME_GET()=1 and IME_GetConverting()!=0
		{
			;日本語入力中
		Send("{ESC}")
		}else{
			;Send,{ESC}
			mode_end()
		}
	}

	return

;####################################################################
run_command()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if (ex_commandline = "w")
		Send("^s")
		else if (ex_commandline = "x")
		Send("^w")
		else if (ex_commandline = "q")
	{
		if WinActive("ahk_class XLMAIN")
		{
			Send("^w")
			return
		}
		Send("!{F4}")
	}
	else
		;todo 未実装色々
		MsgBox(ex_commandline " は未実装です。")
	return

;####################################################################
} ; V1toV2: Added bracket before function
insert_start()
	;エクセルの場合、セルの外だったらセル編集に
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if WinActive("ahk_class XLMAIN")
	{
		temp := ControlGetClassNN(ControlGetFocus())
		if (temp != "EXCEL61")
		{
			Send("{F2}")
			if (A_ThisHotkey = "i")
			{
			Send("^{Home}")
			}
			;挿入モードにはならない方がいい場合は、下のreturnをコメント。
			;通常モードのままセル内に入った方が、cwとか出来て便利？
			return
		}
	}
	vimode := "2"
	return

;####################################################################
} ; V1toV2: Added bracket before function
} ; V1toV2: Added bracket before function
mode_end()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	vimode := "1"
	visualmode := "0"
	command := "0"
	n_count := ""
	commandline := ""
	return

;####################################################################
;#IfWinActive ahk_class Hidemaru32Class
;select_cancel:
;	;Send,{Esc}
;	;選択開始位置に戻る
;	Send,{Left}
;	return
;
;#IfWinActive 
;select_cancel:
;	Send,{Left}
;	Send,{Right}
;	return


;####################################################################
select_cancel()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if WinActive("ahk_class Hidemaru32Class")
	{
		;Send,{Esc}
		;選択開始位置に戻る
		Send("{Left}")
		return
	}
	Send("{Left}")
	Send("{Right}")
	return
} ; V1toV2: Added bracket in the end
} ; V1toV2: Added bracket in the end
