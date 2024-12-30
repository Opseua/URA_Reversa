rem IDENTIFICAR O ARQUIVO E A LOCALIZACAO COMPLETA (sem o nome do arquivo)
Set pathCommand = CreateObject("Scripting.FileSystemObject")
localizacao = pathCommand.GetParentFolderName(WScript.ScriptFullName)
arquivo = pathCommand.GetFileName(WScript.ScriptFullName)
arquivoSemExtensao = ( Replace( arquivo , ".vbs" , "" ) )
arr = Split( localizacao , "\" )
ultimapasta = arr( UBound(arr) )
letra = ( Replace( arr(0) , ":" , "" ) )
localizacao = ( Replace( localizacao , letra + ":\" , "" ) )

rem MsgBox ( Replace( "1: " & letra & "\n2: " & arquivoSemExtensao & "\n3: " & arquivo & "\n4: " & ultimapasta & "\n5: " & localizacao ,"\n",Chr(13)) )

rem BIBLIOTECA VBS
Set Shell = CreateObject("Shell.Application")

rem ---------------------------------------------------------------------------------------

rem BIBLIOTECA VBS
rem Set WshShell = CreateObject("WScript.Shell")

rem PEGAR VARIAVEL DE AMBIENTE
rem fileProjetos = WshShell.ExpandEnvironmentStrings("%fileProjetos%")
rem fileWindows = WshShell.ExpandEnvironmentStrings("%fileWindows%")

rem MUDAR LOCAL DO TERMINAL
rem WshShell.CurrentDirectory = fileProjetos
rem WshShell.CurrentDirectory = letra + ":\" + "ARQUIVOS\PROJETOS"

rem ---------------------------------------------------------------------------------------

rem EXECUTAR COMANDO
commFile = letra + ":\" + localizacao + "\2_SCRIPT.bat"
commPars = Array( arquivoSemExtensao )
comm = """" & commFile & """"
For i = 0 To UBound(commPars): comm = comm & " """ & commPars(i) & """": Next
comm = chr(34) & comm & chr(34)

rem ADM [NAO]
rem Shell.ShellExecute "cmd", "/c " & comm, , , 0
rem ADM [SIM]
Shell.ShellExecute "cmd", "/c " & comm, , "runas", 0

rem ENCERRAR SCRIPT
WScript.Quit



