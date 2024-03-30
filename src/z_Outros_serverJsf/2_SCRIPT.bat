@chcp 65001 && @echo off && setlocal enabledelayedexpansion
set "letra=%~d0" &&  set "local=%~dp0"
set "letra=%letra:~0,1%" && set "local=%local:~0,-1%" && set "arquivo=%~nx0"
set "usuario=%USERNAME%" && set "argTUDO=%~1 %~2 %~3 %~4 %~5" && set "arg1=%~1" && set "arg2=%~2" && set "arg3=%~3" && set "arg4=%~4"

rem set "start=SIM"
rem set "adm=#" && NET SESSION >nul 2>&1
rem if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!" & set "fileAll=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\z_MES_!mes!_DIA_!dia!.txt"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
if "!arg1!"=="" ( msg * "[2_SCRIPT.bat] Usar o atalho e nao o executavel !local!" & exit & exit )

rem →→→ COMO USAR
rem Exemplo 1: # WebScraper # criar a pasta: '.\src\z_Outros_serverC6' → o arquivo a ser executado sera o '.\src\serverC6.js'
rem Exemplo 1: # WebScraper # criar a copia do nodeExe: 'nodeWebScraper_serverC6.exe'
rem Exemplo 2: # WebScraper # criar a pasta: '.\src\z_Outros_serverJucesp' → o arquivo a ser executado sera o '.\src\serverJucesp.js'
rem Exemplo 2: # WebScraper # criar a copia do nodeExe: 'nodeWebScraper_serverJucesp.exe'

rem PROJECT | OUTROSADD | ARQUIVO SCRIPT
for /f "tokens=1,2,3,4,5,6 delims=\" %%a in ("!local!") do ( set "project=%%d" & set "outrosAdd=%%f" ) & set "replace=" & set "outrosAdd=!outrosAdd:z_Outros_=%replace%!"
set "root=!letra!:\ARQUIVOS\PROJETOS"
set "fileScript=!root!\!project!\src\!outrosAdd!.js"
cd\ & !letra!: & cd !root!\!project!

rem TESTES!!!
rem msg * "[2_SCRIPT.bat] arg1: !arg1! - project: !project! - outrosAdd: !outrosAdd! - fileScript: !fileScript!" & exit

rem #####################################################################
rem                   BAT PM2JLIST                                                  AÇÃO WINDOW | PROJECT OUTROSADD    | ARQUIVO    | QUEM EXECUTOU
call "!letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\pm2JList.bat" "!arg1!_WINTP1" "!project!@!outrosAdd!" "!fileScript!" "SCRIPT"
rem                   BAT PROCESSKEEP                                                    AÇÃO WINDOW | PROJECT OUTROSADD    | ARQUIVO    | QUEM EXECUTOU
rem call "!letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\scripts\BAT\processKeep.bat" "!arg1!_WINTP2" "!project!@!outrosAdd!" "!fileScript!" "SCRIPT"
set "ret=!ret2!"

exit

rem ESTAVA RODANDO [SIM]
if "!ret!"=="TRUE" (
	rem !1_BACKGROUND! "explorer"
	set "method=POST" & set "url=http://!confHostOld!:!confPortOld!/EC2_NODEJS"
	set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
	set "body={"fun":[{"securityPass":"!confSecurityPass!","retInf":false,"name":"googleSheets","par":{"action":"send","id":"1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc","tab":"INDICAR_MANUAL","range":"A32","values":[["!timeNow! ^| $ Script parado"]]}}]}"
	set "bodyPath=!TEMP!\wgetBody.txt" && echo !body! > !bodyPath! && if "%~1" == "toggle" ( "!wget!" --post-file=!bodyPath! !headers! --quiet -O- !url! )
)

rem ESTAVA RODANDO [NAO]
if "!ret!"=="FALSE" (
	rem !1_BACKGROUND! "notepad"
	set "method=POST" & set "url=http://!confHostOld!:!confPortOld!/EC2_NODEJS"
	set "headers=--header=Content-Type:application/json --header=chave1:valor1 --header=chave2:valor2"
	set "body={"fun":[{"securityPass":"!confSecurityPass!","retInf":false,"name":"googleSheets","par":{"action":"send","id":"1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc","tab":"INDICAR_MANUAL","range":"A32","values":[["!timeNow! ^| # Aguarde......"]]}}]}"
	set "bodyPath=!TEMP!\wgetBody.txt" && echo !body! > !bodyPath! && if "%~1" == "toggle" ( "!wget!" --post-file=!bodyPath! !headers! --quiet -O- !url! )	
)

exit
exit

rem LER confBat
rem set /p linha=<"!local!\zzz_confBat.json"
rem for /f "tokens=1,2,3,4,5,6,7,8,9,10 delims=_-_-_" %%a in ("!linha!") do ( set "par1=%%a" & set "par2=%%b" & set "par3=%%c" )
rem msg * "[2_SCRIPT.bat] par1: !par1! - par2: !par2! - par3: !par3!" & exit

