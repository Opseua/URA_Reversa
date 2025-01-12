rem IDENTIFICAR O LETRA, LOCALIZACAO, ARQUIVO, PASTA, ETC
Set pathCommand = CreateObject("Scripting.FileSystemObject")
rem letra = Left(WScript.ScriptFullName, 1)                                              rem RESULTADO: 'D'
localizacao = pathCommand.GetParentFolderName(WScript.ScriptFullName)                rem RESULTADO: 'ARQUIVOS\PROJETOS\Sniffer_Python\src\z_OUTROS_server\OFF.vbs'
rem arr = Split(localizacao, "\" )
rem pastaAtual = arr( UBound(arr) )                                                      rem RESULTADO: 'z_OUTROS_server'
rem localizacaoPastaAnterior = Replace( localizacao, "\" & pastaAtual , "" )             rem RESULTADO: 'ARQUIVOS\PROJETOS\Sniffer_Python\src'
arquivo = pathCommand.GetFileName(WScript.ScriptFullName)                            rem RESULTADO: 'arquivoNome.vbs'
arquivoSemExtensao = Replace( arquivo , ".vbs" , "" )                                rem RESULTADO: 'arquivoNome'

rem MsgBox ( Replace( "1: " & letra & "\\n2: " & localizacao & "\\n3: " & pastaAtual & "\\n4: " & localizacaoPastaAnterior & "\\n5: " & arquivo & "\\n6: " & arquivoSemExtensao , "\\n" , Chr(13) ) )

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
rem WshShell.CurrentDirectory = letra & ":\" & "ARQUIVOS\PROJETOS"

rem ---------------------------------------------------------------------------------------

rem EXECUTAR COMANDO
commFile = localizacao & "\2_SCRIPT.bat"
commPars = Array( arquivoSemExtensao )
rem ADICIONAR NA ARRAY OS PARAMETROS PASSADOS
If WScript.Arguments.Count > 0 Then: Dim i, l: For i = 0 To WScript.Arguments.Count - 1: l = UBound(commPars) + 2: ReDim Preserve commPars(l - 1): commPars(UBound(commPars)) = WScript.Arguments(i): Next: End If
comm = """" & commFile & """"
For i = 0 To UBound(commPars): comm = comm & " """ & commPars(i) & """": Next
comm = chr(34) & comm & chr(34)

rem ADM [NAO]
rem Shell.ShellExecute "cmd", "/c " & comm, , , 0
rem ADM [SIM]
Shell.ShellExecute "cmd", "/c " & comm, , "runas", 0

rem ENCERRAR SCRIPT
WScript.Quit


