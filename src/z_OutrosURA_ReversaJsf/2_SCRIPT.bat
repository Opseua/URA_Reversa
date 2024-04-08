@chcp 65001 && @echo off && setlocal enabledelayedexpansion
set "letra=%~d0" && set "letra=%letra:~0,1%" && set "local=%~dp0"
set "local=%local:~0,-1%" && set "arquivo=%~nx0"
set "usuario=%USERNAME%" && set "argTUDO=%~1 %~2 %~3 %~4 %~5" && set "arg1=%~1" && set "arg2=%~2" && set "arg3=%~3" && set "arg4=%~4" && set "arg5=%~5"

rem set "start=SIM"
rem set "adm=#" && NET SESSION >nul 2>&1
rem if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js && for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" && set "dia=!DATE:~0,2!" && set "mes=!DATE:~3,2!" && set "fileAll=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\z_MES_!mes!_DIA_!dia!.txt"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "%arg1%"=="" ( msg * "Usar o atalho e nao o executavel" && exit )

rem PASTA DO PROJETO
set "project=ARQUIVOS\PROJETOS\URA_Reversa"
cd\ && !letra!: && cd !project!

rem CHECAR A ÚLTIMA EXECUÇÃO
set "file=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\logTime!arg3!.txt" && if not exist "!file!" ( set "timeLast=123" ) else ( set /p timeLast=<!file! )
set /a "dif=timeNow - timeLast" && if "!arg1!"=="toggle" ( if not !dif! geq 5 ( echo !TIME! - [NODEJS FILE] = [NAO - !arg2! - !arg1!] # !arg3!>>"!fileAll!" && exit ) )

rem SCRIPT
set "nodeScr=!letra!:\!project!\src\serverJsf.js"

rem CHECK PM2
set "checkPm2JList=!letra!:\ARQUIVOS\WINDOWS\BAT\checkPm2JList.bat"

rem #####################################################################

rem     BAT PM2JLIST    SCRIPT JS    AÇÃO   view/hide  PROJETO  JANELA         AÇÃO → (toggle/on/off)
call "!checkPm2JList!" "!nodeScr!" "!arg1!" "!arg2!" "!arg3!" "winTP5"
echo !timeNow!>!file! && echo !TIME! - [NODEJS FILE] = [SIM - !arg2! - !arg1!] # !arg3! [!ret2!]>>"!fileAll!"
set "ret=!ret2!"

exit
exit

if "!ret!"=="true" (
    goto ENCONTROU_[SIM]
) else (
    goto ENCONTROU_[NAO]
)

:ENCONTROU_[SIM]
rem !1_BACKGROUND! "explorer"
rem sendData [status]
set "url=http://!confHostOld!:!confPortOld!/EC2_NODEJS"
set "method=POST"
set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
set "body={"fun":[{"securityPass":"Password@2023WebSocketRet","retInf":false,"name":"sendData","par":{"stop":false,"status1":"$ Script parado","id":"1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc","tab":"INDICAR_MANUAL","range":"A32"}}]}"
set "bodyPath=!TEMP!\wgetBody.txt"
echo !body! > !bodyPath!
if "!arg1!" == "toggle" (
    "!wget!" --post-file=!bodyPath! !headers! --quiet -O- !url!	
)

exit
exit

:ENCONTROU_[NAO]
rem !1_BACKGROUND! "notepad"
rem sendData [status]
set "url=http://!confHostOld!:!confPortOld!/EC2_NODEJS"
set "method=POST"
set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
set "body={"fun":[{"securityPass":"Password@2023WebSocketRet","retInf":false,"name":"sendData","par":{"stop":false,"status1":"# Aguarde......","id":"1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc","tab":"INDICAR_MANUAL","range":"A32"}}]}"
set "bodyPath=!TEMP!\wgetBody.txt"
echo !body! > !bodyPath!
if "!arg1!" == "toggle" (
    "!wget!" --post-file=!bodyPath! !headers! --quiet -O- !url!	
)

exit
exit

