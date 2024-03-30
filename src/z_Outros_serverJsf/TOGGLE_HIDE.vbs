rem IDENTIFICAR O ARQUIVO E A LOCALIZACAO COMPLETA (sem o nome do arquivo)
Set pathCommand = CreateObject("Scripting.FileSystemObject")
arquivo = pathCommand.GetFileName(WScript.ScriptFullName)
arquivoSemExtensao = (Replace(arquivo,".vbs",""))
localizacao = pathCommand.GetParentFolderName(WScript.ScriptFullName)

rem DIVIDIR O CAMINHO POR '\' | QUANTIDADE DE ARRAYs | ULTIMA PASTA | LETRA DA UNIDADE
arr = Split(localizacao, "\")
qtd = ubound(arr)
ultimapasta = arr(qtd)
letra = arr(0)
rem SUBSTITUIR O ':' DA LETRA DA UNIDADE
letra = (Replace(letra,":",""))
rem SUBSTITUIR O NOME DA ULTIMA PASTA POR NADA
txt = localizacao
pesquisar = "\"+arr(qtd)
substituir = ""
resultado = (Replace(txt,pesquisar,substituir))
rem DEFINIR O DESTINO
localizacao_completa = localizacao                        rem RESULTADO: 'D:\ARQUIVOS\WINDOWS\PORTABLE_Telegram'
localizacao_completa_ate_a_pasta_anterior = resultado     rem RESULTADO: 'D:\ARQUIVOS\WINDOWS'
localizacao_so_a_ultima_pasta = ultimapasta               rem RESULTADO: 'PORTABLE_Telegram'

rem ############################ NOME DO PROJETO ############################
project = arr(3)
outros = arr(5)

rem →→→ COMO USAR
rem o nome do arquivo do '.vbs' e o paramentro que sera passado ao '2_SRIPT.BAT' so e necessario criar uma copia e definir o nome

rem ############################ ABRIR ARQUIVO COM PARAMETROS ############################
file = letra + ":\ARQUIVOS\WINDOWS\BAT\RUN_PORTABLE\1_BACKGROUND.exe"
par1 = localizacao + "\2_SCRIPT.bat"
par2 = arquivoSemExtensao
par3 = "PAR OU VAR 3"
par4 = "PAR OU VAR 4"
par5 = "PAR OU VAR 5"
aspas = """"
fileAndPars = aspas & file & aspas & " " & aspas & par1 & aspas & " " & aspas & par2 & aspas & " " & aspas & par3 & aspas & " " & aspas & par4 & aspas & " " & aspas & par5 & aspas
CreateObject("WScript.Shell").Run(fileAndPars)

rem ENCERRAR SCRIPT
WScript.Quit









