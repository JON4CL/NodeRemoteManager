'------------------------------------------------------------------------------
' SRMCommon.VBS
' FUNCIONES COMUNES A LOS SCRIPTS
' 20170109 -  VERSION INICIAL
'------------------------------------------------------------------------------

'CLEAN AND GET VALUE FROM A VARIABLE 
Function getValue(ByRef Value)
	Dim Tmp

	IF VarType(Value) >= 8192 THEN
		Tmp = ""
		For Each item in Value 
			Tmp = Tmp & """" & getValue(item) & ""","
		Next
		IF Len(Tmp) > 0 THEN
			Tmp = Left(Tmp, Len(Tmp)-1)
		END IF
	ELSE
		Tmp = Value & ""
		'ESCAPE BACKSLASH
		Tmp = Replace(Tmp, "\", "\\")
		'ESCAPE DOUBLE CUOTE
		Tmp = Replace(Tmp, Chr(34), Chr(92) & Chr(34))
	END IF
	
	'RETURN THE VALUE
	getValue = Tmp
End Function

'REMOVE ALL NON PRINTABLE CHARS
Function removeNonPrintable(ByRef Value)
	'REPLACE NEW LINES WITH SPACES
	Value = Replace(Value, chr(013) & chr(010), " ")
	'REPLACE ALL NON PRINTABLE CHARS
	Set objRegEx = CreateObject("VBScript.RegExp")
	objRegEx.Global = True
	objRegEx.Pattern =  "[^\u0020-\u007F]+"
	removeNonPrintable = objRegEx.Replace(Value, "")
End Function

'GET NOW DATE FORMATED
Function getDateddmmyyyy()
    getDateddmmyyyy = Right("0" & Day(Now),2) & "-" & Right("0" & Month(Now),2) & "-" & Year(Now)
End Function

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
'------------------------------------------------------------------------------