<!-- : Begin batch script
@echo off

:: Ensure System32 is in the PATH, to avoid weird
:: 'cscript' is not recognized as an internal or external command"" errors.
set PATH=%PATH%;%SYSTEMROOT%\System32
cscript //nologo "%~f0?.wsf" "%~dp0"
exit /b

----- Begin wsf script --->
<job>
	<script language="VBScript">
	Const wbemFlagForwardOnly = 32
	Const wbemFlagReturnImmediately = 16
	
	'ESPACIO EN DISCOS, TOTAL Y USADA
	strList = "["
	Set oFileSystem = CreateObject("Scripting.FileSystemObject") 
	Set colItems = oFileSystem.Drives 
	strItem = ""
	For Each objItem In colItems
		'REMOVABLE OR FIXED
		If objItem.DriveType = 1 OR objItem.DriveType = 2 Then
			strItem = strItem & "{"
			strItem = strItem & """Id"":""" & objItem & ""","
			strItem = strItem & """Total"":""" & objItem.TotalSize & ""","
			strItem = strItem & """Used"":""" & objItem.TotalSize - objItem.AvailableSpace & ""","
			strItem = strItem & """Free"":""" & objItem.AvailableSpace & ""","
			strItem = strItem & """UsedPercent"":""" & Round((((objItem.TotalSize - objItem.AvailableSpace)*100)/objItem.TotalSize)) & """"
			strItem = strItem & "},"
		end if
	Next
	strItem = Left(strItem, Len(strItem)-1)
	strList = strList & strItem & ","
	
	'MEMORIA RAM , TOTAL Y USADA
	strList = strList & ""
	strComputer = "."
	Set objWMIService = GetObject("winmgmts:\\" & strComputer & "\root\cimv2")
	Set colItems = objWMIService.ExecQuery("Select * from Win32_OperatingSystem",,wbemFlagReturnImmediately + wbemFlagForwardOnly)
	strItem = ""
	For Each objItem in colItems
		strItem = strItem & "{"
		strItem = strItem & """Total"":""" & objItem.TotalVisibleMemorySize & ""","
		strItem = strItem & """Used"":""" & objItem.TotalVisibleMemorySize - objItem.FreePhysicalMemory & ""","
		strItem = strItem & """Free"":""" & objItem.FreePhysicalMemory & ""","
		strItem = strItem & """UsedPercent"":""" & Round((((objItem.TotalVisibleMemorySize - objItem.FreePhysicalMemory)*100)/objItem.TotalVisibleMemorySize)) & """"
		strItem = strItem & "},"
	Next
	strItem = Left(strItem, Len(strItem)-1)
	strList = strList & strItem & ","
	
	'CANTIDAD DE PROCESOS CORRIENDO
	strList = strList & ""
	strComputer = "."
	Set objWMIService = GetObject("winmgmts:\\" & strComputer & "\root\cimv2")
	Set colItems = objWMIService.ExecQuery("Select * from Win32_Process",,wbemFlagReturnImmediately)
	strItem = ""
	strItem = strItem & "{"
	strItem = strItem & """Running"":""" & colItems.Count & """"
	strItem = strItem & "},"
	strItem = Left(strItem, Len(strItem)-1)
	strList = strList & strItem & ","
	
	'CANTIDAD DE SERVICIOS CORRIENDO
	strList = strList & ""
	strComputer = "."
	Set objWMIService = GetObject("winmgmts:\\" & strComputer & "\root\cimv2")
	Set colItems = objWMIService.ExecQuery("Select * from Win32_Service",,wbemFlagReturnImmediately + wbemFlagForwardOnly)
	serviceTotal = 0
	serviceStarted = 0
	strItem = ""
	For Each objItem in colItems	
		serviceTotal = serviceTotal + 1
		if (objItem.Started = true) then
			serviceStarted = serviceStarted + 1
		end if
	Next
	strItem = strItem & "{"
	strItem = strItem & """Total"":""" & serviceTotal & ""","
	strItem = strItem & """Started"":""" & serviceStarted & ""","
	strItem = strItem & """Stoped"":""" & serviceTotal - serviceStarted & """"
	strItem = strItem & "},"
	strItem = Left(strItem, Len(strItem)-1)
        strList = strList & strItem & ","
	
	'SCREENSHOT
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
	
	Const TemporaryFolder = 2
	Dim tempFolder
	tempFolder = oFileSystem.GetSpecialFolder(TemporaryFolder)
	tempName = oFileSystem.GetTempName() & ".jpg"
	
	'CAPTURE SCREENSHOT
        pathExec = Wscript.Arguments(0)
	const DontWaitUntilFinished = false, ShowWindow = 1, DontShowWindow = 0, WaitUntilFinished = true
	set oShell = WScript.CreateObject("WScript.Shell")
	command = pathExec & "SRMTools.exe -t" & tempName & " -p" & tempFolder
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
	strItem = strItem & "},"
	strItem = Left(strItem, Len(strItem)-1)
		
	If oFileSystem.FileExists(tempFolder & "\" & tempName) Then
		oFileSystem.DeleteFile tempFolder & "\" & tempName
	End If
	
	strList = strList & strItem & "]"
	WScript.Echo strList
	
	</script>
</job>