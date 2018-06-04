<!-- : Begin batch script
@echo off

:: Ensure System32 is in the PATH, to avoid weird
:: 'cscript' is not recognized as an internal or external command"" errors.
set PATH=%PATH%;%SYSTEMROOT%\System32

cscript //nologo "%~f0?.wsf" %1 %2
exit /b

----- Begin wsf script --->
'------------------------------------------------------------------------------
' SERVICES.VBS
' GENERA LISTADO DE SERVICIOS DISPONIBLES
' 20170109 -  VERSION INICIAL
'------------------------------------------------------------------------------

<job id="Main">
	<script language="VBScript" src="SRMCommon.vbs"/>
	<script language="VBScript">
	Const wbemFlagForwardOnly = 32
	Const wbemFlagReturnImmediately = 16
	Const CONVERT_TO_LOCAL_TIME = True

	'FORMAT DAY MONTH YEAR
	DateToCheckStart = ""
	'IF NO ARGUMENT RECEIVED, PROCESS THE SAME DAY
	IF Wscript.Arguments.Count > 0 THEN
		DateToCheckStart = Wscript.Arguments(0)
	END IF
	iF IsDate(DateToCheckStart) = false THEN
		DateToCheckStart = CDate(getDateddmmyyyy)
	END IF
	
	DateToCheckEnd = ""
	'IF NO ARGUMENT RECEIVED, PROCESS THE SAME DAY
	IF Wscript.Arguments.Count > 0 THEN
		DateToCheckEnd = Wscript.Arguments(1)
	END IF
	iF IsDate(DateToCheckEnd) = false THEN
		DateToCheckEnd = CDate(getDateddmmyyyy)
	END IF

	'DATETIME OBJECTS
	Set dtmStartDate = CreateObject("WbemScripting.SWbemDateTime")
	Set dtmEndDate = CreateObject("WbemScripting.SWbemDateTime")
	
	dtmStartDate.SetVarDate DateToCheckStart, CONVERT_TO_LOCAL_TIME
	dtmEndDate.SetVarDate DateAdd("d", 1, DateToCheckEnd), CONVERT_TO_LOCAL_TIME

	'---GET THE WMI OBJECT---
	strComputer = "."
	Set objWMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!\\" & strComputer & "\root\cimv2")

	'---EVENT LOG---
	' class Win32_NTLogEvent
	' {
	  ' uint16   Category;
	  ' string   CategoryString;
	  ' string   ComputerName;
	  ' uint8    Data[];
	  ' uint16   EventCode;
	  ' uint32   EventIdentifier;
	  ' uint8    EventType;
	  ' string   InsertionStrings[];
	  ' string   Logfile;
	  ' string   Message;
	  ' uint32   RecordNumber;
	  ' string   SourceName;
	  ' datetime TimeGenerated;
	  ' datetime TimeWritten;
	  ' string   Type;
	  ' string   User;
	' };

	Set colItems = objWMIService.ExecQuery("Select * from Win32_NTLogEvent Where TimeWritten >= '" & dtmStartDate & "' and TimeWritten < '" & dtmEndDate & "'") 
	strItem = ""
	' For Each objItem in colItems
		' strItem = strItem & "{"
		' strItem = strItem & """Category"":""" & getValue(objItem.Category) & ""","
		' strItem = strItem & """CategoryString"":""" & getValue(objItem.CategoryString) & ""","
		' strItem = strItem & """ComputerName"":""" & getValue(objItem.ComputerName) & ""","
		' strItem = strItem & """Data"":[" & getValue(objItem.Data) & "],"
		' strItem = strItem & """EventCode"":""" & getValue(objItem.EventCode) & ""","
		' strItem = strItem & """EventIdentifier"":""" & getValue(objItem.EventIdentifier) & ""","
		' strItem = strItem & """EventType"":""" & getValue(objItem.EventType) & ""","
		' strItem = strItem & """InsertionStrings"":[" & getValue(objItem.InsertionStrings) & "],"
		' strItem = strItem & """Logfile"":""" & getValue(objItem.Logfile) & ""","
		' strItem = strItem & """Message"":""" & getValue(objItem.Message) & ""","
		' strItem = strItem & """RecordNumber"":""" & getValue(objItem.RecordNumber) & ""","
		' strItem = strItem & """SourceName"":""" & getValue(objItem.SourceName) & ""","
		' strItem = strItem & """TimeGenerated"":""" & getValue(objItem.TimeGenerated) & ""","
		' strItem = strItem & """TimeWritten"":""" & getValue(objItem.TimeWritten) & ""","
		' strItem = strItem & """Type"":""" & getValue(objItem.Type) & ""","
		' strItem = strItem & """User"":""" & getValue(objItem.User) & """"
		' strItem = strItem & "},"
	' Next
	For Each objItem in colItems
		strItem = strItem & "{"
		strItem = strItem & """EventType"":""" & getValue(objItem.EventType) & ""","
		strItem = strItem & """Logfile"":""" & getValue(objItem.Logfile) & ""","
		strItem = strItem & """Message"":""" & getValue(objItem.Message) & ""","
		strItem = strItem & """RecordNumber"":""" & getValue(objItem.RecordNumber) & ""","
		strItem = strItem & """TimeGenerated"":""" & getValue(objItem.TimeGenerated) & ""","
		strItem = strItem & """SourceName"":""" & getValue(objItem.SourceName) & """"
		strItem = strItem & "},"
	Next
	
	If (Len(strItem) > 0) Then
		strItem = Left(strItem, Len(strItem)-1)
	End If

	strList = strList & "[" & strItem & "]"

	'REMOVE ALL NON PRINTABLE CHARS
	strList = removeNonPrintable(strList)
	
	'PRINT OUTPUT
	WScript.Echo strList
	</script>
</job>