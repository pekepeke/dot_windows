// VB ソース整形

var keyword = new Array("#Const", "#Else", "#End", "#If", "Abs", "Add", "AddPrinterConnection", 
		"AddWindowsPrinterConnection", "AddressOf", "Alias", "And", "AppActivate", 
		"Append", "Arguments", "Array", "As", "Asc", "AtEndOfLine", "AtEndOfStream", 
		"Atn", "Attribute", "Attributes", "AvailableSpace", "BOF", "Begin", "BeginProperty", 
		"Boolean", "BuildPath", "ByRef", "ByVal", "Byte", "CBool", "CByte", "CCur", "CDate", 
		"CDbl", "CInt", "CLng", "CSng", "CStr", "Call", "Case", "Character", "Chr", "Class", 
		"Class_Initialize", "Class_Terminate", "Clear", "Close", "Column", "CompareMode", 
		"ComputerName", "ConnectObject", "Const", "Copy", "CopyFile", "CopyFolder", "Cos", 
		"Count", "CreateFolder", "CreateObject", "CreateScript", "CreateShortcut", 
		"CreateTextFile", "Currency", "CurrentDirectory", "Date", "DateAdd", "DateCreated",
		"DateDiff", "DateLastAccessed", "DateLastModified", "DatePart", "DateSerial", 
		"DateValue", "Day", "Declare", "DefBool", "DefByte", "DefCur", "DefDate", "DefDbl", 
		"DefInt", "DefLng", "DefObj", "DefSng", "DefStr", "DefVar", "Delete", "DeleteFile", 
		"DeleteFolder", "Description", "Dictionary", "Dim", "DisconnectObject", "Do", 
		"Double", "Drive", "DriveExists", "DriveLetter", "DriveType", "Drives", "DrivesExists",
		"EOF", "Each", "Echo", "Else", "ElseIf", "Empty", "End", "EndProperty", 
		"EnumNetworkDrives", "EnumPrinterConnections", "Environment", "Eqv", "Erase", 
		"Error", "Eval", "Exec", "Execute", "ExecuteGlobal", "Exists", "Exit", "ExitCode", 
		"Exp", "ExpandEnvironmentStrings", "Explicit", "False", "FileExists", "FileSystem", 
		"FileSystemObject", "FileSystemProperty", "Files", "Filter", "Fix", "FolderExists", 
		"For", "FormatCurrency", "FormatDateTime", "FormatNumber", "FormatPercent", 
		"FreeSpace", "Friend", "FullName", "Function", "Get", "GetAbsolutePathName", 
		"GetBaseName", "GetDrive", "GetDriveName", "GetExtensionName", "GetFile", 
		"GetFileName", "GetFileVersion", "GetFolder", "GetLocale", "GetObject", 
		"GetParentFolderName", "GetRef", "GetSpecialFolder", "GetTempName", "Global", 
		"GoSub", "GoTo", "Hex", "Hotkey", "Hour", "IconLocation", "If", "Imp", "In", 
		"InStr", "InStrRev", "InputBox", "Int", "Integer", "Interactive", "Is", "IsArray", 
		"IsDate", "IsEmpty", "IsNull", "IsNumeric", "IsObject", "IsReady", "IsRootFolder", 
		"Item", "Items", "Join", "Key", "Keys", "LBound", "LCase", "LSet", "LTrim", "Left", 
		"Len", "Length", "Let", "Lib", "Like", "Line", "LoadPicture", "Log", "LogEvent", 
		"Long", "Loop", "MapNetworkDrive", "Me", "Mid", "Minute", "Mod", "Month", "MonthName",
		"Move", "MoveFile", "MoveFolder", "MsgBox", "Name", "New", "Next", "Not", "Nothing", 
		"Now", "Null", "Number", "Object", "Oct", "On", "OpenAsTextStream", "OpenTextFile",
		"Option", "Optional", "Or", "Output", "ParentFolder", "Path", "Popup", "Private", 
		"ProcessID", "Property", "Public", "Quit", "RGB", "RSet", "RTrim", "Raise", 
		"Randomize", "ReDim", "Read", "ReadAll", "ReadLine", "RegDelete", "RegRead", 
		"RegWrite", "Rem", "Remove", "RemoveAll", "RemoveNetworkDrive", "RemovePrinterConnection",
		"Replace", "Resume", "Return", "Right", "Rnd", "RootFolder", "Round", "Run", 
		"Save", "ScriptFullName", "ScriptName", "Scripting", "Scripting.Dictionary", 
		"Scripting.FileSystemObject", "Second", "Select", "SendKeys", "SerialNumber", 
		"Set", "SetDefaultPrinter", "Sgn", "ShareName", "ShortName", "ShortPath", 
		"ShowUsage", "Sin", "Single", "Size", "Skip", "SkipLine", "SkipLine ", "Sleep", 
		"Source", "SourceText", "Space", "SpecialFolders", "Split", "Sqr", "Static", 
		"Status", "StdErr", "StdIn", "StdOut", "Step", "Stop", "StrComp", "StrReverse", 
		"String", "Sub", "SubFolders", "Tan", "TargetPath", "Terminate", "Test", 
		"TextStream", "Then", "Time", "TimeSerial", "TimeValue", "Timer", "To", 
		"TotalSize", "Trim", "True", "Type", "TypeName", "UBound", "UCase", "Until", 
		"UserDomain", "UserName", "VarType", "Variant", "VbCrLf", "Version", "VolumeName", 
		"WScript", "Weekday", "WeekdayName", "Wend", "While", "WindowStyle", "With", 
		"WorkingDirectory", "Write", "WriteBlankLines", "WriteLine", "WshArguments", 
		"WshController", "WshEnvironment", "WshNamed", "WshNetwork", "WshRemote", 
		"WshRemoteError", "WshScriptExec", "WshShell", "WshShortcut", "WshSpecialFolders", 
		"WshUnnamed", "WshUrlShortcut", "Xor", "Year", "getResource", "vbAbort", 
		"vbAbortRetryIgnore", "vbApplicationModal", "vbArray", "vbBinaryCompare", 
		"vbBlack", "vbBlue", "vbBoolean", "vbByte", "vbCancel", "vbCr", "vbCritical", 
		"vbCurrency", "vbCyan", "vbDataObject", "vbDate", "vbDecimal", "vbDefaultButton1",
		"vbDefaultButton2", "vbDefaultButton3", "vbDefaultButton4", "vbEmpty", "vbError", 
		"vbExclamation", "vbFalse", "vbFirstFourDays", "vbFirstFullWeek", "vbFirstJan1", 
		"vbFormFeed", "vbFriday", "vbGeneralDate", "vbGreen", "vbIgnore", "vbInformation", 
		"vbInteger", "vbLf", "vbLong", "vbLongDate", "vbLongTime", "vbMagenta", "vbMonday", 
		"vbNewLine", "vbNo", "vbNull", "vbNullChar", "vbNullString", "vbOK", "vbOKCancel", 
		"vbOKOnly", "vbObject", "vbObjectError", "vbQuestion", "vbRed", "vbRetry", 
		"vbRetryCancel", "vbSaturday", "vbShortDate", "vbShortTime", "vbSingle", 
		"vbString", "vbSunday", "vbSystemModal", "vbTab", "vbTextCompare", "vbThursday", 
		"vbTrue", "vbTuesday", "vbUseDefault", "vbUseSystemDayOfWeek", "vbVariant", 
		"vbVerticalTab", "vbWednesday", "vbWhite", "vbYellow", "vbYes", "vbYesNo", 
		"vbYesNoCancel")

main();

function main(){
	var e = Editor;
	e.MoveHistSet();
	// 選択範囲がなければ全選択
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
   
	text = e.GetSelectedString(0);
   
	e.InsText( modifyReturnCode(
		getModifyVBString(text)
		));
	e.MoveHistPrev();
}

// 改行コードを現在の文書に合わせる
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

// 文字列生成
function getModifyVBString(text){
	var len = keyword.length;
	for (var i=0;i<len;i++){
		var regex = new RegExp("([ \t]*)"+keyword[i]+"([ \t\r\n])","ig");
		text = text.replace(regex, "$1"+keyword[i]+"$2");
	}
	return text;
}

