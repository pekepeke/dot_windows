	Set popup = CreateObject("EditorHelper.PopUp")
	
	With popup
		.AddMenu "Menu 1",	 1
		.CreateSubmenu "Sub"
		.AddSubmenu "Sub 1",  2
		.AddSubmenu "Sub 2",  3
		.AddSubmenu "Sub 3",  4
		.AddMenuSeparator
		.AddMenu "Menu 2",	 5
		ret = .TrackMenu()
		.DeleteMenu
	End With
	
	Set clip = CreateObject("EditorHelper.Clipboard")
	
	clip.CopyText(ret)
	msg = msg & clip.GetText() & vbCr & vbLF 
	
	clip.CopyText("TEST")
	msg = msg & clip.GetText() & vbCr & vbLF 
	
	Set ini = CreateObject("EditorHelper.Ini")
	section = "MRU"
	key = "MRUFOLDER[00]"
	Call ini.SetIniFilePath( Editor.ExpandParameter("$I") )
	msg = msg & ini.GetProfileString( CStr(section), CStr(key) ) 
	
	MsgBox msg
	
	