; vim: set sw=4 sts=4 ts=4 tw=0 noet ai:
#Include %A_ScriptDir%
#Include IME.ahk


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
vimode=0

;0:通常（選択モードではない）
;1:文字選択モード  2:行選択モード  3:矩形選択モード(対応アプリのみ)
visualmode=0

;カットバッファ内が行単位の場合に、1
yankmode = 0

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
command=0

n_count=
commandline=
ex_commandline=

;"/" or  "?"
searchmode=
searchword=


;####################################################################
;有効/無効 トグル
;####################################################################
#IfWinNotActive ahk_class Vim
;vimode on/off
^]:: 
	if vimode=0
	{
		vimode=1
		gosub,mode_end
		settimer,draw_tooltip ,100
	}
	else
	{
		gosub,mode_end
		vimode=0
		settimer,draw_tooltip,off
		tooltip,
	}
	return
#IfWinNotActive

;vi系のウィンドウでは無効化のみ
#IfWinActive ahk_class Vim
^]:: 
	vimode=0
	settimer,draw_tooltip,off
	tooltip,
	return
#IfWinNotActive

;####################################################################
;状態描画
;####################################################################
draw_tooltip:
	WinGetActiveStats, title,myWide,myHigh,myX,myY
	myWide=10 ;固定位置
	myHigh -= 20

	;MouseGetPos, myWide, myHigh
	;myWide+=10
	;myHigh+=5

	if vimode=0
		;tooltip,novimode, %myWide%,%myHigh%
		tooltip,
	else if vimode=1
	{
		if visualmode=0
			tooltip,vimode, %myWide%,%myHigh%
		else if visualmode=1
			tooltip,vimode[-visual-], %myWide%,%myHigh%
		else if visualmode=2
			tooltip,vimode[-visual line-], %myWide%,%myHigh%
		else if visualmode=3
			tooltip,vimode[-visual box-], %myWide%,%myHigh%
	}
	else if vimode=2
		tooltip,vimode[-insert-], %myWide%,%myHigh%
	else if vimode=3
		tooltip,vimode[%n_count%], %myWide%,%myHigh%
	else if vimode=31 ;replace用
		tooltip,vimode[%n_count%%commandline%], %myWide%,%myHigh%
	else if vimode=4
		tooltip,vimode[%commandline%%n_count%], %myWide%,%myHigh%
	else if vimode=5
		tooltip,vimode[:], %myWide%,%myHigh%
	else if vimode=6
		tooltip,vimode[%searchmode%%searchword%], %myWide%,%myHigh%
	else if vimode=7
		tooltip,vimode[-replace-], %myWide%,%myHigh%
	else
		msgbox,error(%vimode%)
	return
	
;####################################################################
;通常モード
;####################################################################
#If ( vimode=1 )
	ESC::
	^[::
		gosub,input_escape
		return

	Enter::
		Send,{down}
		return

	;################################
	;カーソル移動系
	;################################
	h::gosub,move_h
	j::gosub,move_j
	k::gosub,move_k
	l::gosub,move_l
	w::gosub,move_w
	e::gosub,move_e
	b::gosub,move_b
	0::gosub,move_0
	$::gosub,move_$
	^::gosub,move_^
	+::gosub,move_+
	-::gosub,move_-
	^f::gosub,move_^f
	^b::gosub,move_^b

	+G::
		if visualmode=0
			Send,^{End}
		else
			Send,+^{End}
		return

	;センテンス移動は難しいのでエクセル等で便利なCtrl上下を設定しておく
	(::Send,^{UP}
	)::Send,^{Down}

	;################################
	;行結合
	;################################
	+j::
		Send,{End}
		Send,{End}
		Send,{Delete}
		return


	;################################
	;undo/redo
	;################################
	u::
		Send,^z
		return

	^r::
		Send,^y

	;################################
	;挿入モード移行
	;################################
	;カーソル位置に挿入
	i::gosub,insert_start

	;行頭に挿入
	+i::
		if visualmode=1
			return
		Send,{Home}
		gosub,insert_start
		return

	;カーソル位置の右に追加
	a::
		if visualmode=1
			return

		IfWinActive ahk_class XLMAIN 
		{
			ControlGetFocus, temp
			if temp=EXCEL61
			{
				Send,{Right}
			}
			gosub,insert_start
			return
		}
		Send,{Right}
		gosub,insert_start
		return

	;行末尾に追加
	+a::
		if visualmode=1
			return
		Send,{end}
		gosub,insert_start
		return

	;1行追加
	o::
		if visualmode=1
			return
		Send,{end}
		Send,{end}
		gosub,input_enter
		gosub,insert_start
		return

	;1行挿入
	+o::
		if visualmode=1
			return
		Send,{Home}
		Send,{Home}
		gosub,input_enter
		Send,{Up}
		gosub,insert_start
		return

	;1文字変更
	s::
		Send,{Delete}
		gosub,insert_start
		return

	;1行変更
	+s::
		Send,{Home}
		Send,+{End}
		Send,{Delete}
		gosub,insert_start
		return

	;行末まで変更
	+c::
		Send,+{End}
		Send,{Delete}
		gosub,insert_start
		return

	;################################
	;変更モード
	;################################
	r::
		IfWinActive ahk_class XLMAIN 
		{
			ControlGetFocus, temp
			if temp!=EXCEL61
			{
				Send,{F2}
				Send,^{Home}
				return
			}
		}

		vimode=4	;ツールチップ表示用にコマンドモードへ変更
		command=5	;#ifで他のマップに判定されないように
					;（他のマップに判定されると、inputよりもホットキーの方が優先される）
		commandline=r
		input, temp, 'B C L1', {ESC}, 
		;msgbox,%ErrorLevel%
		if ErrorLevel=Max
		{
			Send,+{Right}
			Send,{%temp%}
			Send,{Left}
		}
		gosub,mode_end
		return

	+r::
		vimode=7
		Send,{insert}
		return


	;################################
	;visualモード（範囲選択開始）
	;################################
	v:: 
		if visualmode=1
		{
			visualmode=0
			gosub,select_cancel
		}
		else 
		{
			visualmode=1
			;デフォルトで1文字選択
			Send,+{Right}
		}
		return

	+v::
		if visualmode=2
			visualmode=0
		else
		{
			visualmode=2
			Send,{Home}
			Send,+{Down}
		}
		return

	;^v::visualmode=3
	


	;################################
	;コマンド開始
	;################################
	d::
		vimode=4
		command=1

		commandline=d
		return

	y::
		;通常モード
		if visualmode=0
		{
			;ヤンク開始
			vimode=4
			command=2
			commandline=y
		}
		;文字選択中
		if visualmode=1
		{
			Send,^c
			gosub,select_cancel
			yankmode=0
		}
		;行選択中
		if visualmode=2
		{
			Send,^c
			gosub,select_cancel
			Send,{Home}
			yankmode=1
		}
		visualmode=0
		return

	g::
		vimode=4
		command=3
		commandline=g
		return

	c::
		if visualmode<>0
		{
			Send,{Delete}
			gosub,insert_start
		}
		vimode=4
		command=4
		commandline=c
		return
		return
	
	;################################
	;クリップボード操作
	;################################
	x::
		;エクセルのセル外の場合、内容をコピーしてから内容削除
		IfWinActive ahk_class XLMAIN 
		{
			ControlGetFocus, temp
			if temp!=EXCEL61
			{
				Send,{F2}
				Send,^{home}
				Send,+^{End}
				Send,^c
				;Send,{F2}	;F2だとセル編集が終了していない様に見える
				Send,{ESC}
				Send,{Delete}
				return
			}
		}
		if visualmode=0
			Send,+{Right}
		Send,^x
		return

	+x::
		if visualmode=0
			Send,+{Left}
		Send,^x
		return
	
	+d::
		if visualmode=0
			Send,+{End}
		else
		{
			Send,{Home}
			Send,+{End}
		}
		Send,^x
		return
	
	p::
		if yankmode=0
		{
			Send,{Right}
			Send,^v
			Send,{Left}
		}
		else if yankmode=1
		{
			Send,{Home}
			Send,{Home}
			Send,{Down}
			Send,^v
			Send,{Up}
		}
		else if yankmode=excelline
		{
			Send,{Down}
			Send,+{Space}
			Send,+{F10}
			Send,e
		}
		return

	+p::
		if yankmode=0
		{
			Send,^v
			Send,{Left}
		}
		else if yankmode=1
		{
			Send,{Home}
			Send,{Home}
			Send,^v
			Send,{Up}
		}
		else if yankmode=excelline
		{
			Send,+{Space}
			Send,+{F10}
			Send,e
		}
		return

	;################################
	;数値指定(開始)※2桁目移行は別途
	;################################
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
		vimode=3
		;vimode=4
		;command=0
		n_count=%A_ThisHotkey%
		return

	;################################
	;コマンドラインモード
	;################################
	::: 
		vimode=5	;ツールチップ表示変更と、inputboxに文字が入力できるように。
		inputbox ex_commandline ,vimode:,,,,100
		vimode=1	;通常モードに戻る
		if ErrorLevel != 0
			return
		gosub,run_command
	`;::return
		
	;################################
	;検索
	;################################
	/::
		Send,^f
		sleep,20
		gosub,insert_start
		return

	;?::
		
#If

;####################################################################
;挿入モード or 置換モード
;####################################################################
#if ( vimode=2 or vimode=7)

	ESC:: 
	^[:: 
		if vimode=7	;repraceの場合は、
		{
			Send,{insert}	;insertキーを押してエディタのモードを挿入モードに戻す。todo:たまにモードずれが起こる
		}

		;todo imeがオンの場合、入力キャンセルせずにinsertモードが終る or 入力キャンセルしてinsertモードが終る の二択。
		; IME OFF時、インサートモード終了としたい。エクセル上だとセルまで抜ける←対応済み
		gosub,input_escape
		return


	^h::Send,{BS}
	^i::Send,{Tab}

	^j::
	^m::
	enter::
		gosub,input_enter
		return

	;インデント(カーソル位置が保持できないので使い道が無いかも)
	^t::
		Send,{Home}
		Send,{Tab}
		return

	;補完(エディタによる)
	;^n::
	;^p::
#if

;####################################################################
;数字入力以降処理
;####################################################################
#if ( vimode=3 )
	ESC:: 
	^[:: 
		gosub,input_escape
		return

	^h::
		StringLen, len, n_count
		len--
		;MsgBox, %len%
		if len = 0
			gosub,mode_end
		else
			StringLeft, n_count, n_count, %len%
		return

	;################################
	;数値入力
	;################################
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
		n_count=%n_count%%A_ThisHotkey%
		return

	;################################
	;カーソル移動
	;################################
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
		loop %n_count%
		{
			gosub,move_cursor
		}
		n_count=
		gosub,mode_end
		return

	

	;################################
	;変更
	;################################
	s::
		loop %n_count%
		{
			Send,+{Right}
		}
		n_count=
		Send,^x
		gosub,mode_end
		gosub,insert_start
		return

	;################################
	;置換
	;################################
	r::
		vimode=31 ;ツールチップ表示、マップ隔離
		commandline=r
		input, temp, 'B C L1', {ESC}, 
		if ErrorLevel=Max
		{
			loop %n_count%
			{
				Send,+{Right}
			}
			loop %n_count%
			{
				Send,{%temp%}
			}
			Send,{Left}
		}
		n_count=
		gosub,mode_end
		return

	;################################
	;削除
	;################################
	x::
		loop %n_count%
		{
			Send,+{Right}
		}
		n_count=
		Send,^x
		gosub,mode_end
		return
	+x::
		loop %n_count%
		{
			Send,+{Left}
		}
		n_count=
		Send,^x
		gosub,mode_end
		return

	;################################
	;指定行ジャンプ
	;################################
	g::
		IfWinActive ahk_class Hidemaru32Class
		{
			Send,^g
			Send,%n_count%
			n_count=
			Send,{Enter}
			return
		}
		return

#if


;####################################################################
;delete中
;####################################################################
#if ( vimode=4 and command=1 )
	ESC::
	^[::
		gosub,input_escape
		return

	d::
		;エクセルのセル内に入るとClassNNが「EXCEL61」になる
		IfWinActive ahk_class XLMAIN
		{
			ControlGetFocus, temp
			if temp!=EXCEL61
			{
				yankmode=excelline
				Send,+{space}
				Send,^x
				gosub,mode_end
				return
			}
		}
		yankmode=1
		Send,{Home}
		Send,+{Down}
		Send,^x
		gosub,mode_end
		return

	;################################
	;数値入力
	;################################
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
		n_count=%n_count%%A_ThisHotkey%
		return

	;################################
	;範囲削除
	;################################
	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
		yankmode=0
		visualmode=1

		if n_count= 
			n_count=1
		loop %n_count%
		{
			gosub,move_cursor
		}
		n_count=

		Send,^x
		gosub,mode_end
		return
#if

;####################################################################
;yank中
;####################################################################
#if ( vimode=4 and command=2 )
	ESC::
	^[::
		gosub,input_escape
		return

	y::

		;excelで行選択コピー
		;エクセルのセル内に入るとClassNNが「EXCEL61」になる
		IfWinActive ahk_class XLMAIN
		{
			ControlGetFocus, temp
			if temp!=EXCEL61
			{
				yankmode=excelline
				Send,+{space}		;todo日本語入力モードだとおかしくなる(セル内に半角スペース入力)
				Send,^c
				gosub,mode_end
				return
			}
		}
		yankmode=1
		Send,{Home}
		Send,+{Down}
		Send,^c
		Send,{Up}
		gosub,mode_end
		return

	;################################
	;数値入力
	;################################
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
		n_count=%n_count%%A_ThisHotkey%
		return

	;################################
	;範囲コピー
	;################################
	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
		yankmode=0
		visualmode=1

		if n_count= 
			n_count=1
		loop %n_count%
		{
			gosub,move_cursor
		}
		n_count=

		Send,^c
		gosub,mode_end
		return
#if

;####################################################################
;command g gg 
;####################################################################
#if ( vimode=4 and command=3 )
	ESC::
	^[::
		gosub,input_escape
		return

	g::
		if visualmode =0
			Send,^{Home}
		else
			Send,+^{Home}
		gosub,mode_end
		return
#if

;####################################################################
;command c change
;####################################################################
#if (vimode=4 and command=4 )
	ESC::
	^[::
		gosub,input_escape
		return

	;1行変更(Sと同じ)
	c::
		Send,{Home}
		Send,+{End}
		Send,{Delete}
		gosub,insert_start
		return

	;################################
	;数値入力
	;################################
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
		n_count=%n_count%%A_ThisHotkey%
		return

	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
		yankmode=0
		visualmode=1

		if n_count= 
			n_count=1
		loop %n_count%
		{
			gosub,move_cursor
		}
		n_count=

		Send,^x
		gosub,mode_end
		gosub,insert_start
		return
#if


;####################################################################
;カーソル移動系
;####################################################################
move_h:
	if visualmode=0
		Send,{Left}
	else if visualmode=1
		Send,+{Left}
	return

move_j:
	if visualmode=0
		Send,{Down}
	else
		Send,+{Down}
	return

move_k:
	if visualmode=0
		Send,{Up}
	else 
		Send,+{Up}
	return

move_l:
	if visualmode=0
		Send,{Right}
	else if visualmode=1
		Send,+{Right}
	return

move_w:
	if visualmode=0
		Send,^{Right}
	else if visualmode=1
		Send,^+{Right}
	return

move_e:
	if visualmode=0
	{
		Send,{Right}
		Send,^{Right}
		Send,{Left}
	}
	else if visualmode=1
	{
		Send,+{Right}
		Send,^+{Right}
		Send,+{Left}
	}
	return

move_b:
	if visualmode=0
		Send,^{Left}
	else if visualmode=1
		Send,^+{Left}
	return

move_0:
	if visualmode=0
		Send,{Home}
	else if visualmode=1
		Send,+{Home}
	return

move_$:
	if visualmode=0
		Send,{End}
	else if visualmode=1
		Send,+{End}
	return

move_^:
	if visualmode=0
	{
		Send,{Home}
		Send,{Home}
	}
	else if visualmode=1
	{
		Send,+{Home}
		Send,+{Home}
	}
	return

move_+:
	if visualmode=0
	{
		Send,{Home}
		Send,{Down}
	}
	else if visualmode=1
	{
		Send,{Home}
		Send,{Down}
	}
	return

move_-:
	if visualmode=0
	{
		Send,{Home}
		Send,{Up}
	}
	else if visualmode=1
	{
		Send,+{Home}
		Send,+{Up}
	}
	return

move_^f:
	if visualmode=0
		Send,{PgDn}
	else
		Send,+{PgDn}
	return

move_^b:
	if visualmode=0
		Send,{PgUp}
	else
		Send,+{PgUp}
	return

move_cursor:
	if      A_ThisHotkey = h
		gosub,move_h
	else if A_ThisHotkey = j
		gosub,move_j
	else if A_ThisHotkey = k
		gosub,move_k
	else if A_ThisHotkey = l
		gosub,move_l
	else if A_ThisHotkey = w
		gosub,move_w
	else if A_ThisHotkey = e
		gosub,move_e
	else if A_ThisHotkey = b
		gosub,move_b
	else if A_ThisHotkey = +
		gosub,move_+
	else if A_ThisHotkey = -
		gosub,move_-
	else if command=0 ;カット、ヤンク等には頁移動は含まない
	{
		if      A_ThisHotkey = ^f
			gosub,move_^f
		else if A_ThisHotkey = ^b
			gosub,move_^b
	}
	return

;####################################################################
;通常モード(vimode=1)で呼ばれることは無いはず？
input_enter:

	;excel
	IfWinActive ahk_class XLMAIN 
	{					;excelの場合
		ControlGetFocus, temp
		if temp=EXCEL61	;セル内
		{
			;Send,!{Enter}
			;todo 日本語の確定がおかしくなる。未確定文字列があれば、確定のみ(enterのみ)。
			;未確定文字列無ければALT-Enterのみ。としたい。
			StringCaseSense, On
			if A_ThisHotkey in o,+o	;暫定対処
			Send,!{Enter}
			else
				Send,{Enter}	;日本語確定 or セル確定(現状insertモードのままセルを抜けてしまう)
		}
		else			;セル外
			Send,{enter}
	}
	else				;excel以外
	{
		Send,{enter}
	}
	return

;####################################################################
input_escape:

	;セルの編集内容が有無を言わせず失われて悲しい思いをしないために
	IfWinActive ahk_class XLMAIN
	{
		ControlGetFocus, temp
		if temp=EXCEL61		;セル内
		{
			if vimode=1		;通常モード
			{
				vimode=0	;次のダイアログで、ynが押せるように
				msgbox,3,vimode,セル編集内容を確定しますか？
				vimode=1	;モード終了するので必要ないが、一応通常モードに戻しておく

				ifmsgbox,Yes
					Send,{Enter}
				ifmsgbox,No
					Send,{ESC}
				ifmsgbox,Cancel	;キャンセルはセル編集モードのまま
					return
			}
			;セル内で通常モード以外の場合は、ESCを発行せずに後続のmode_endを実行
			;(todo:未確定の日本語入力がキャンセルされず挿入モードが終る)
		}
		else				;セル外
			Send,{ESC}
	}
	else	;エクセル以外
	{	
		if IME_GET()=1 and IME_GetConverting()!=0
		{
			;日本語入力中
		Send,{ESC}
		}else{
			;Send,{ESC}
			gosub,mode_end
		}
	}

	return

;####################################################################
run_command:
	if ex_commandline = w
		Send,^s
	else if ex_commandline = x
		Send,^w
	else if ex_commandline = q
	{
		IfWinActive ahk_class XLMAIN
		{
			Send,^w
			return
		}
		Send,!{F4}
	}
	else
		;todo 未実装色々
		msgbox, %ex_commandline% は未実装です。
	return

;####################################################################
insert_start:
	;エクセルの場合、セルの外だったらセル編集に
	IfWinActive ahk_class XLMAIN
	{
		ControlGetFocus, temp
		if temp!=EXCEL61
		{
			Send,{F2}
			if A_ThisHotkey = i
			{
			Send,^{Home}
			}
			;挿入モードにはならない方がいい場合は、下のreturnをコメント。
			;通常モードのままセル内に入った方が、cwとか出来て便利？
			return
		}
	}
	vimode=2
	return

;####################################################################
mode_end:
	vimode=1
	visualmode=0
	command=0
	n_count=
	commandline=
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
select_cancel:
	IfWinActive ahk_class Hidemaru32Class
	{
		;Send,{Esc}
		;選択開始位置に戻る
		Send,{Left}
		return
	}
	Send,{Left}
	Send,{Right}
	return
