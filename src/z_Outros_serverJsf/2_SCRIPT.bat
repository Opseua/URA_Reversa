@chcp 65001 & @echo off & setlocal enabledelayedexpansion
set "letra=%~d0" & set "local=%~dp0"
set "letra=%letra:~0,1%" & set "local=%local:~0,-1%" & set "arquivo=%~nx0" & set "argString=%*"
set "usuario=%USERNAME%" & set "argTUDO=%~1 %~2 %~3 %~4 %~5" & set "arg1=%~1" & set "arg2=%~2"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!" == "" ( !3_BACKGROUND! /NOCONSOLE "cmd.exe /c !fileMsg! "[!local!\!arquivo!]\\n\\nNENHUM PARAMETRO PASSADO"" & exit )

rem NET SESSION > nul 2>&1 & if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

rem echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a" & set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!"

rem ********************************************************************************************************************************************************

rem PROJECT | OUTROSADD | ARQUIVO SCRIPT
for /f "tokens=1,2,3,4,5,6 delims=\" %%a in ("!local!") do ( set "project=%%d" & set "outrosAdd=%%f" )
set "outrosAdd=!outrosAdd:z_OUTROS_=!" & set "programExe=node"

rem NAO CHECAR NOVAMENTE SE ESTA RODANDO (PORQUE JA FOI PASSADO O RETORNO)
if not "!argString!" == "!argString:TRUE=!" ( set "ret=TRUE" & goto IGNORE_CHECK_IS_RUNNING ) else ( if not "!argString!" == "!argString:FALSE=!" ( set "ret=FALSE" & goto IGNORE_CHECK_IS_RUNNING ) )

rem CHECAR SE ESTA RODANDO
tasklist /fi "ImageName eq !programExe!!project!_!outrosAdd!.exe" /fo csv 2> nul | find /I "!programExe!!project!_!outrosAdd!.exe" > nul
if "%ERRORLEVEL%" == "0" ( set "ret=TRUE" ) else ( set "ret=FALSE" )
:IGNORE_CHECK_IS_RUNNING

rem ESTA RODANDO [NAO]
rem if "!ret!" == "FALSE" ( if "!arg1!" == "!arg1:OFF=!" ( ) )

rem ESTA RODANDO [SIM]
rem if "!ret!" == "TRUE" ( )

rem MANTER O '"%ret%"' E 'argString' NO FINAL SEMPRE!!! | 'KEEP' (RESTART [SIM]) / 'LEGACY' (RESTART [NAO])
endlocal & call "%fileChrome_Extension%\src\scripts\BAT\process.bat" "%arg1%_WINTP2" "%project%" "%outrosAdd%" "KEEP" "%programExe%" "%ret%" "%arg2%" & setlocal enabledelayedexpansion
set "ret=%ret2%" & set "argString=%*"
rem #####################################################################

rem APENAS ENCERRAR E NAO CONTINUAR O BAT
rem if not "!argString!" == "!argString:FORCE_STOP=!" ( exit )


