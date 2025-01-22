Set fso = CreateObject("Scripting.FileSystemObject")                          rem * BIBLIOTECAS VBS
pathCompleto = WScript.ScriptFullName                                         rem → 'D:\ARQUIVOS\SINCRONIZADO\FILE.vbs'
rem letra = Split( pathCompleto , ":" )(0)                                        rem → 'D'
local = fso.GetParentFolderName(pathCompleto)                                 rem → 'D:\ARQUIVOS\SINCRONIZADO'
rem pastaAtual = fso.GetFileName(local)                                           rem → 'SINCRONIZADO'
rem pathAtePastaAnterior = Split( pathCompleto , "\" & pastaAtual & "\" )(0)      rem → 'D:\ARQUIVOS'
arquivo = Replace( fso.GetFileName(pathCompleto) , ".vbs" , "" )              rem → 'FILE'

rem MsgBox ( Replace( "1: " & pathCompleto & "\\n2: " & letra & "\\n3: " & local & "\\n4: " & pastaAtual & "\\n5: " & pathAtePastaAnterior & "\\n6: " & arquivo , "\\n" , Chr(13) ) )

rem ---------------------------------------------------------------------------------------

rem BIBLIOTECAS VBS
Set Shell = CreateObject("Shell.Application")
rem Set WshShell = CreateObject("WScript.Shell")
rem PEGAR VARIAVEL DE AMBIENTE
rem fileProjetos = WshShell.ExpandEnvironmentStrings("%fileProjetos%")
rem fileWindows = WshShell.ExpandEnvironmentStrings("%fileWindows%")
rem MUDAR LOCAL DO TERMINAL
rem WshShell.CurrentDirectory = fileProjetos

rem ---------------------------------------------------------------------------------------

rem CRIAR ARRAY DE PARAMETROS VAZIA
Dim commPars(): ReDim commPars(-1)

rem PARAMETROS MANUAIS [ADICIONADO NO INICIO DA ARRAY] (COMENTAR PARA DESATIVAR)
ReDim Preserve commPars(UBound(commPars) + 1): commPars(UBound(commPars)) = local & "\2_SCRIPT.bat"
ReDim Preserve commPars(UBound(commPars) + 1): commPars(UBound(commPars)) = arquivo

rem ADICIONAR TODOS OS PARAMETROS NA ARRAY | CRIAR COMANDO DE LINHA COM PARAMETROS ENTRE ASPAS DUPLAS
If WScript.Arguments.Count > 0 Then: Dim i: For i = 0 To WScript.Arguments.Count - 1: ReDim Preserve commPars(UBound(commPars) + 1): commPars(UBound(commPars)) = WScript.Arguments(i): Next: End If
comm = "": For i = 0 To UBound(commPars): If i > 0 Then comm = comm & " " End If: comm = comm & Chr(34) & commPars(i) & Chr(34): Next: comm = Chr(34) & comm & Chr(34)

rem EXECUTAR COMANDO → ADM [NAO]
rem Shell.ShellExecute "cmd", "/c " & comm, , , 0
rem EXECUTAR COMANDO → ADM [SIM]
Shell.ShellExecute "cmd", "/c " & comm, , "runas", 0

rem ENCERRAR SCRIPT
WScript.Quit


