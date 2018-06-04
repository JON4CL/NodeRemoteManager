<!-- : Begin batch script
@echo off

:: Ensure System32 is in the PATH, to avoid weird
:: 'cscript' is not recognized as an internal or external command"" errors.
set PATH=%PATH%;%SYSTEMROOT%\System32
cscript //nologo "%~f0?.wsf" "%~dp0" "%1"
exit /b

----- Begin wsf script --->
<job>
	<script language="VBScript">
	Public Function convertImageToBase64(filePath)
		Dim inputStream
		Set inputStream = CreateObject("ADODB.Stream")
		inputStream.Open
		inputStream.Type = 1  ' adTypeBinary
		inputStream.LoadFromFile filePath
		Dim bytes: bytes = inputStream.Read
		Dim dom: Set dom = CreateObject("Microsoft.XMLDOM")
		Dim elem: Set elem = dom.createElement("tmp")
		elem.dataType = "bin.base64"
		elem.nodeTypedValue = bytes
		convertImageToBase64 = "data:image/png;base64," & Replace(elem.text, vbLf, "")
	End Function
	
	'TEMP NAMES
	Const TemporaryFolder = 2
	Dim tempFolder
        Set oFileSystem = CreateObject("Scripting.FileSystemObject")
	tempFolder = oFileSystem.GetSpecialFolder(TemporaryFolder)
	tempName = oFileSystem.GetTempName() & ".jpg"
	
	'CAPTURE SCREENSHOT
        pathExec = Wscript.Arguments(0)
        params = " " & Wscript.Arguments(1)
	const DontWaitUntilFinished = false, ShowWindow = 1, DontShowWindow = 0, WaitUntilFinished = true
	set oShell = WScript.CreateObject("WScript.Shell")
	command = pathExec & "SRMTools.exe -f" & tempName & " -p" & tempFolder & params
	oShell.Run command, DontShowWindow, WaitUntilFinished

	'GET IMAGE DIMENSIONS
	Const HimPerPixS = 26.45834
	Dim oPic
	Set oPic = LoadPicture(tempFolder & "\" & tempName)
	screenWidth = CLng(oPic.Width / HimPerPixS)
	screenHeight = CLng(oPic.Height / HimPerPixS)
	imgB64 = convertImageToBase64(tempFolder & "\" & tempName)
	
	strItem = "{"
	strItem = strItem & """Width"":""" & screenWidth & ""","
	strItem = strItem & """Height"":""" & screenHeight & ""","
	strItem = strItem & """Data"":""" & imgB64 & """"
	strItem = strItem & "}"
	
	If oFileSystem.FileExists(tempFolder & "\" & tempName) Then
		oFileSystem.DeleteFile tempFolder & "\" & tempName
	End If
	
	WScript.Echo strItem
	</script>
</job>