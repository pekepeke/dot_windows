; vim: set sw=4 sts=4 ts=4 tw=0 noet ai:
#Include "%A_ScriptDir%"
#Include "IME.ahk"


;�����l
;####################################################################

; �� #if �Ɏg�p�ł���͉̂p���̂݁H blank�͔���s�\

;0 (VI���[�h����)
;1 normal
;2 insert
;3 Number
;4 Command
;5 Command line
;6 Search
;7 Replace
vimode := "0"

;0:�ʏ�i�I�����[�h�ł͂Ȃ��j
;1:�����I�����[�h  2:�s�I�����[�h  3:��`�I�����[�h(�Ή��A�v���̂�)
visualmode := "0"

;�J�b�g�o�b�t�@�����s�P�ʂ̏ꍇ�ɁA1
yankmode := "0"

;[vimode=4]
;0 -
;1 delete
;2 yank
;3 g   gg(�t�@�C���擪)
;4 c   change
;5 r   replace
;(�ȉ��������@���聦���G�f�B�^��z��H������,eclipse,sakura,hidemaru���H)
;6 m   bookmark 
;7 '   bookmark
;8 f   ����
;9 F   �O������
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
;�L��/���� �g�O��
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

;vi�n�̃E�B���h�E�ł͖������̂�
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
;��ԕ`��
;####################################################################
draw_tooltip()
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	title := WinGetTitle("A")
WinGetPos(&myX, &myY, &myWide, &myHigh, "A")
	myWide := "10" ;�Œ�ʒu
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
		else if (vimode = 31) ;replace�p
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
;�ʏ탂�[�h
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
	;�J�[�\���ړ��n
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

	;�Z���e���X�ړ��͓���̂ŃG�N�Z�����ŕ֗���Ctrl�㉺��ݒ肵�Ă���
} ; V1toV2: Added Bracket before hotkey or Hotstring
	(::	Send("^{UP}")
	)::	Send("^{Down}")

	;################################
	;�s����
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
	;�}�����[�h�ڍs
	;################################
	;�J�[�\���ʒu�ɑ}��
} ; V1toV2: Added Bracket before hotkey or Hotstring
	i::	insert_start()

	;�s���ɑ}��
	+i::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 1)
			return
		Send("{Home}")
		insert_start()
		return

	;�J�[�\���ʒu�̉E�ɒǉ�
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

	;�s�����ɒǉ�
} ; V1toV2: Added Bracket before hotkey or Hotstring
	+a::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 1)
			return
		Send("{end}")
		insert_start()
		return

	;1�s�ǉ�
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

	;1�s�}��
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

	;1�����ύX
} ; V1toV2: Added Bracket before hotkey or Hotstring
	s::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("{Delete}")
		insert_start()
		return

	;1�s�ύX
} ; V1toV2: Added Bracket before hotkey or Hotstring
	+s::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("{Home}")
		Send("+{End}")
		Send("{Delete}")
		insert_start()
		return

	;�s���܂ŕύX
} ; V1toV2: Added Bracket before hotkey or Hotstring
	+c::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("+{End}")
		Send("{Delete}")
		insert_start()
		return

	;################################
	;�ύX���[�h
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

		vimode := "4"	;�c�[���`�b�v�\���p�ɃR�}���h���[�h�֕ύX
		command := "5"	;#if�ő��̃}�b�v�ɔ��肳��Ȃ��悤��
					;�i���̃}�b�v�ɔ��肳���ƁAinput�����z�b�g�L�[�̕����D�悳���j
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
	;visual���[�h�i�͈͑I���J�n�j
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
			;�f�t�H���g��1�����I��
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
	;�R�}���h�J�n
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
		;�ʏ탂�[�h
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (visualmode = 0)
		{
			;�����N�J�n
			vimode := "4"
			command := "2"
			commandline := "y"
		}
		;�����I��
		if (visualmode = 1)
		{
			Send("^c")
			select_cancel()
			yankmode := "0"
		}
		;�s�I��
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
	;�N���b�v�{�[�h����
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	x::
		;�G�N�Z���̃Z���O�̏ꍇ�A���e���R�s�[���Ă�����e�폜
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
				;Send,{F2}	;F2���ƃZ���ҏW���I�����Ă��Ȃ��l�Ɍ�����
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
	;���l�w��(�J�n)��2���ڈڍs�͕ʓr
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
	;�R�}���h���C�����[�h
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	::: 
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		vimode := "5"	;�c�[���`�b�v�\���ύX�ƁAinputbox�ɕ��������͂ł���悤�ɁB
		IB := InputBox("", "vimode:", "h100"), ex_commandline := IB.Value, ErrorLevel := IB.Result="OK" ? 0 : IB.Result="CANCEL" ? 1 : IB.Result="Timeout" ? 2 : "ERROR"
		vimode := "1"	;�ʏ탂�[�h�ɖ߂�
		if (ErrorLevel != 0)
			return
		run_command()
} ; V1toV2: Added Bracket before hotkey or Hotstring
	`;::return
		
	;################################
	;����
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
;�}�����[�h or �u�����[�h
;####################################################################
#HotIf ( vimode=2 or vimode=7)

	ESC:: 
	^[:: 
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if (vimode = 7)	;reprace�̏ꍇ�́A
		{
			Send("{insert}")	;insert�L�[�������ăG�f�B�^�̃��[�h��}�����[�h�ɖ߂��Btodo:���܂Ƀ��[�h���ꂪ�N����
		}

		;todo ime���I���̏ꍇ�A���̓L�����Z��������insert���[�h���I�� or ���̓L�����Z������insert���[�h���I�� �̓���B
		; IME OFF���A�C���T�[�g���[�h�I���Ƃ������B�G�N�Z���ゾ�ƃZ���܂Ŕ����適�Ή��ς�
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

	;�C���f���g(�J�[�\���ʒu���ێ��ł��Ȃ��̂Ŏg��������������)
} ; V1toV2: Added Bracket before hotkey or Hotstring
	^t::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		Send("{Home}")
		Send("{Tab}")
		return

	;�⊮(�G�f�B�^�ɂ��)
	;^n::
	;^p::
} ; V1toV2: Added bracket in the end
#HotIf

;####################################################################
;�������͈ȍ~����
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
	;���l����
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
	;�J�[�\���ړ�
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
	;�ύX
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
	;�u��
	;################################
} ; V1toV2: Added Bracket before hotkey or Hotstring
	r::
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		vimode := "31" ;�c�[���`�b�v�\���A�}�b�v�u��
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
	;�폜
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
	;�w��s�W�����v
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
;delete��
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
		;�G�N�Z���̃Z�����ɓ����ClassNN���uEXCEL61�v�ɂȂ�
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
	;���l����
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
	;�͈͍폜
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
;yank��
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

		;excel�ōs�I���R�s�[
		;�G�N�Z���̃Z�����ɓ����ClassNN���uEXCEL61�v�ɂȂ�
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
		if WinActive("ahk_class XLMAIN")
		{
			temp := ControlGetClassNN(ControlGetFocus())
			if (temp != "EXCEL61")
			{
				yankmode := "excelline"
				Send("+{space}")		;todo���{����̓��[�h���Ƃ��������Ȃ�(�Z�����ɔ��p�X�y�[�X����)
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
	;���l����
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
	;�͈̓R�s�[
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

	;1�s�ύX(S�Ɠ���)
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
	;���l����
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
;�J�[�\���ړ��n
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
		else if (command = 0) ;�J�b�g�A�����N���ɂ͕ňړ��͊܂܂Ȃ�
	{
		if (A_ThisHotkey = "^f")
			move__f()
				else if (A_ThisHotkey = "^b")
			move__b()
	}
	return

;####################################################################
;�ʏ탂�[�h(vimode=1)�ŌĂ΂�邱�Ƃ͖����͂��H
} ; V1toV2: Added bracket before function
input_enter()

	;excel
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if WinActive("ahk_class XLMAIN")
	{					;excel�̏ꍇ
		temp := ControlGetClassNN(ControlGetFocus())
		if (temp = "EXCEL61")	;�Z����
		{
			;Send,!{Enter}
			;todo ���{��̊m�肪���������Ȃ�B���m�蕶���񂪂���΁A�m��̂�(enter�̂�)�B
			;���m�蕶���񖳂����ALT-Enter�̂݁B�Ƃ������B
			A_StringCaseSense := true
			if (A_ThisHotkey ~= "^(?i:o|\+o)$")	;�b��Ώ�
			Send("!{Enter}")
			else
				Send("{Enter}")	;���{��m�� or �Z���m��(����insert���[�h�̂܂܃Z���𔲂��Ă��܂�)
		}
		else			;�Z���O
			Send("{enter}")
	}
	else				;excel�ȊO
	{
		Send("{enter}")
	}
	return

;####################################################################
} ; V1toV2: Added bracket before function
input_escape()

	;�Z���̕ҏW���e���L�������킹�������Ĕ߂����v�������Ȃ����߂�
{ ; V1toV2: Added bracket
global ; V1toV2: Made function global
	if WinActive("ahk_class XLMAIN")
	{
		temp := ControlGetClassNN(ControlGetFocus())
		if (temp = "EXCEL61")		;�Z����
		{
			if (vimode = 1)		;�ʏ탂�[�h
			{
				vimode := "0"	;���̃_�C�A���O�ŁAyn��������悤��
				msgResult := MsgBox("�Z���ҏW���e���m�肵�܂����H", "vimode", 3)
				vimode := "1"	;���[�h�I������̂ŕK�v�Ȃ����A�ꉞ�ʏ탂�[�h�ɖ߂��Ă���

				if (msgResult = "Yes")
					Send("{Enter}")
				if (msgResult = "No")
					Send("{ESC}")
				if (msgResult = "Cancel")	;�L�����Z���̓Z���ҏW���[�h�̂܂�
					return
			}
			;�Z�����Œʏ탂�[�h�ȊO�̏ꍇ�́AESC�𔭍s�����Ɍ㑱��mode_end�����s
			;(todo:���m��̓��{����͂��L�����Z�����ꂸ�}�����[�h���I��)
		}
		else				;�Z���O
			Send("{ESC}")
	}
	else	;�G�N�Z���ȊO
	{	
		if IME_GET()=1 and IME_GetConverting()!=0
		{
			;���{����͒�
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
		;todo �������F�X
		MsgBox(ex_commandline " �͖������ł��B")
	return

;####################################################################
} ; V1toV2: Added bracket before function
insert_start()
	;�G�N�Z���̏ꍇ�A�Z���̊O��������Z���ҏW��
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
			;�}�����[�h�ɂ͂Ȃ�Ȃ����������ꍇ�́A����return���R�����g�B
			;�ʏ탂�[�h�̂܂܃Z�����ɓ����������Acw�Ƃ��o���ĕ֗��H
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
;	;�I���J�n�ʒu�ɖ߂�
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
		;�I���J�n�ʒu�ɖ߂�
		Send("{Left}")
		return
	}
	Send("{Left}")
	Send("{Right}")
	return
} ; V1toV2: Added bracket in the end
} ; V1toV2: Added bracket in the end
