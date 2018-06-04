<!-- : Begin batch script
@echo off

:: Ensure System32 is in the PATH, to avoid weird
:: 'cscript' is not recognized as an internal or external command"" errors.
set PATH=%PATH%;%SYSTEMROOT%\System32

cscript //nologo "%~f0?.wsf" %1 %2 %3
exit /b

----- Begin wsf script --->
<job><script language="VBScript">
Function ShowFileList(dirPath, showFolders, showFiles)
   On Error Resume Next
   Dim fso, f, file, folder, fc, s
   Set fso = CreateObject("Scripting.FileSystemObject")
   Set f = fso.GetFolder(dirPath)
   Set fc = f.SubFolders
   
   if (showFolders = "Y") THEN
	   For Each folder in fc
		  s = s & "{""NAME"":""" & folder.name & """,""LASTMODIFIED"":""" & folder.DateLastModified & """,""TYPE"":""D"",""SIZE"":""" & folder.size & """},"
	   Next
	end if
	
	if (showFiles = "Y") THEN
		Set fc = f.Files
		For Each file in fc
			s = s & "{""NAME"":""" & file.name & """,""LASTMODIFIED"":""" & file.DateLastModified & """,""TYPE"":""F"",""SIZE"":""" & file.size & """},"
		Next
	end if
   ShowFileList = s
End Function

Dim fileList
Dim dirPath
If (WScript.Arguments.Count > 0) Then
	dirPath = Trim(WScript.Arguments.Item(0))
	showFolders = Trim(WScript.Arguments.Item(1))
	showFiles = Trim(WScript.Arguments.Item(2))
	If Len(dirPath) > 0 Then
		If Right(dirPath, 1) <> "\\" Then
			dirPath = dirPath & "\\"
		End If
		fileList = showFileList(dirPath, showFolders, showFiles)
		If Len(fileList) > 0 Then
			fileList = Left(fileList, Len(fileList)-1)
		End If
	End If
End If

Wscript.Echo "[" & fileList & "]"
</script></job>