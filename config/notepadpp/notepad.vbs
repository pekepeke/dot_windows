Option Explicit
Dim sCmd, x, arg
sCmd = """" & LeftB(WScript.ScriptFullName, LenB(WScript.ScriptFullName) - LenB(WScript.ScriptName)) & "notepad++.exe" & """"
If WScript.Arguments.Count > 1 Then
For x = 1 To WScript.Arguments.Count - 1
arg = arg & " " & WScript.Arguments( x )
Next
sCmd = sCmd & " """ & trim(arg) & """"
End If
CreateObject("WScript.Shell").Run sCmd, 1, True
WScript.Quit