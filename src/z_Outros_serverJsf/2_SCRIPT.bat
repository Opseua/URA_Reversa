@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2" & set "arg3=%~3" & set "arg4=%~4" & set "arg5=%~5"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" equ "" !fileMsg! "[!local!\!arquivo!]\n\nNao usar o BAT/BACKGROUND" & exit

rem set "start=ERRO" & set "adm=ERRO" & NET SESSION >nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem →→→ COMO USAR: Definir o 'mode'
rem Exemplo 1: # WebScraper # criar a pasta: '.\src\z_Outros_serverC6' → o arquivo a ser executado sera o '.\src\serverC6.js'
rem Exemplo 1: # WebScraper # criar a copia do nodeExe: 'nodeWebScraper_serverC6.exe'
rem Exemplo 2: # WebScraper # criar a pasta: '.\src\z_Outros_serverJucesp' → o arquivo a ser executado sera o '.\src\serverJucesp.js'
rem Exemplo 2: # WebScraper # criar a copia do nodeExe: 'nodeWebScraper_serverJucesp.exe'

rem MODE →→→ 'CMD' (RESTART [SIM]) / 'LEGACY' (RESTART [NAO]) # PROJECT | OUTROSADD | ARQUIVO SCRIPT
for /f "tokens=1,2,3,4,5,6 delims=\" %%a in ("!local!") do ( set "project=%%d" & set "outrosAdd=%%f" ) & set "replace="
set "outrosAdd=!outrosAdd:z_Outros_=%replace%!" & set "scriptType=ERRO"
set "mode=CMD" & set "root=!letra!:\ARQUIVOS\PROJETOS" & set "fileScript=!root!\!project!\src\!outrosAdd!.js" & cd\ & !letra!: & cd !root!\!project!
rem #### ↑↑↑↑↑↑↑↑↑ ##########################################################

rem CHECAR SE ESTA RODANDO
rem tasklist /fi "ImageName eq node!project!_!outrosAdd!.exe" /fo csv 2>NUL | find /I "node!project!_!outrosAdd!.exe">NUL
rem if "%ERRORLEVEL%"=="0"  ( set "ret=TRUE" ) else ( set "ret=FALSE" )

if "!arg1!"=="!arg1:OFF=!" (
	rem ESTA RODANDO [SIM]
	rem if "!ret!"=="TRUE" ( )

	rem ESTA RODANDO [NAO]
	rem if "!ret!"=="FALSE" ( )
)

rem  (NAO SUBIR OS 'if'!!!)
if "!mode!"=="CMD" ( set "scriptType=processCmdKeep" )
if "!mode!"=="LEGACY" ( set "scriptType=processCmdKeep" )
if "!scriptType!" equ "ERRO" !fileMsg! "[!local!\!arquivo!]\n'mode' deve ser\n'CMD', 'LEGACY'" & exit
endlocal & call "%fileChrome_Extension%\src\scripts\BAT\%scriptType%.bat" "%arg1%_WINTP2" "%project%@%outrosAdd%" "%fileScript%" "%mode%" & setlocal enabledelayedexpansion
set "ret=%ret2%"
rem #####################################################################

rem APENAS ENCERRAR E NAO CONTINUAR O BAT
if "%~2"=="FORCE_STOP" ( exit )

exit
exit

rem TIMESTAMP ATUAL (OBRIGATORIO FICAR APOS O CALL!!!)
rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
rem set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem ESTAVA RODANDO [SIM]
rem if "!ret!"=="TRUE" ( )

rem ESTAVA RODANDO [NAO]
rem if "!ret!"=="FALSE" ( )

exit
exit