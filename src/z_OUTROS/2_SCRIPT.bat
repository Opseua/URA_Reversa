@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "local=%~dp0" & set "local=!local:~0,-1!" & set "letra=!local:~0,1!" & set "arquivo=%~nx0" & set "argString=%*" & set "arg1=%~1" & set "arg2=%~2"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" == "" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nNENHUM PARAMETRO PASSADO"" & exit )
rem NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )
rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "tNow=%%a" & set "tNow=!tNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"
rem ********************************************************************************************************************************************************

rem POSICIONAMENTO | MODO | ENGINE | ARQUIVO SERVER | ACAO
for /f "tokens=4 delims=\" %%p in ("%local%") do ( set "project=%%p" )
set "wind=WINTP2" & set "mode=KEEP" & set "engine=node" & set "serverFile=!arg1!" & set "action=!arg2!"

rem NAO CHECAR NOVAMENTE SE ESTA RODANDO (PORQUE JA FOI PASSADO O RETORNO)
if not "!argString!" == "!argString:TRUE=!" ( set "ret=TRUE" & goto IGNORE_CHECK_IS_RUNNING ) else ( if not "!argString!" == "!argString:FALSE=!" ( set "ret=FALSE" & goto IGNORE_CHECK_IS_RUNNING ) )

rem CHECAR SE ESTA RODANDO
set "programExe=!engine!-!project!-!serverFile!.exe"
tasklist /fi "ImageName eq !programExe!" /fo csv 2> nul | find /I "!programExe!" > nul
if "%errorlevel%" == "0" ( set "ret=TRUE" ) else ( set "ret=FALSE" )
:IGNORE_CHECK_IS_RUNNING

rem MANTER O '"%ret%"' E 'argString' NO FINAL SEMPRE!!! | 'KEEP' (RESTART [SIM]) / 'LEGACY' (RESTART [NAO])
rem → "(project) WebScraper" "(serverFile) serverC6_New2" "(action) OFF/ON_HIDE/ON_VIEW/TOGGLE_HIDE/TOGGLE_VIEW [FORCE_STOP] {_WINTP2_}" "(mode) KEEP" "(ret) TRUE" "(engine) python"
endlocal & call "%fileChrome_Extension%\src\scripts\BAT\process.bat" "%project%" "%serverFile%" "%action% _%wind%_" "%mode%" "%ret%" "%engine%" & setlocal enabledelayedexpansion
set "ret=%ret2%" & set "argString=%*"
rem #####################################################################

rem APENAS ENCERRAR E NAO CONTINUAR O BAT
rem if not "!argString!" == "!argString:FORCE_STOP=!" ( exit )


