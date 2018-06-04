<!-- : Begin batch script
@echo off

:: Ensure System32 is in the PATH, to avoid weird
:: 'cscript' is not recognized as an internal or external command"" errors.
set PATH=%PATH%;%SYSTEMROOT%\System32

cscript //nologo "%~f0?.wsf"
exit /b

----- Begin wsf script --->
<job><script language="VBScript">
strComputer = "."
driveList = ""
Set objWMIService = GetObject("winmgmts:" & "{impersonationLevel=impersonate}!\\" & strComputer & "\root\cimv2")
Set colDisks = objWMIService.ExecQuery("Select * from Win32_LogicalDisk")
For Each objDisk in colDisks
	driveList = driveList & "{""DEVICEID"":""" & objDisk.DeviceID & """,""FREESPACE"":""" & objDisk.FreeSpace & """},"
Next
Wscript.Echo "[" & Left(driveList, Len(driveList)-1) & "]"
</script></job>