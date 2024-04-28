await import('./resources/@export.js');

let e = import.meta.url, ee = e;
async function serverRun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `**************** SERVER ****************` })

        let infLog, retLog, infGoogleSheets, retGoogleSheets, err, time

        // DADOS GLOBAIS DA PLANILHA E FAZER O PARSE
        gO.inf['id'] = '1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc'; gO.inf['tab'] = 'INDICAR_AUTOMATICO';
        let range = 'A2', id = gO.inf.id, tab = gO.inf.tab
        infGoogleSheets = {
            'e': e, 'action': 'get',
            'id': id,
            'tab': tab,
            'range': range,
        }
        retGoogleSheets = await googleSheets(infGoogleSheets);
        if (!retGoogleSheets.ret) {
            err = `$ Erro ao pegar dados para planilha`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` });
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGoogleSheets }
            retLog = await log(infLog);
            return retGoogleSheets
        } else {
            retGoogleSheets = retGoogleSheets.res[0][0]
        }
        gO.inf['json'] = JSON.parse(retGoogleSheets)
        let colInf = inf && inf.col ? inf.col : gO.inf.json['colUra'];
        let autInf = inf && inf.autJsf ? inf.autJsf : gO.inf.json['autUraJsf'];
        let conSplInf = inf && inf.conSpl ? inf.conSpl : gO.inf.json['conSpl'];
        let loginInf = inf && inf.loginJsf ? inf.loginJsf : gO.inf.json['loginJsf'];
        let passwordInf = inf && inf.passwordJsf ? inf.passwordJsf : gO.inf.json['passwordJsf'];
        let scriptHour = inf && inf.scriptHourJsf ? inf.scriptHourJsf.split('|') : gO.inf.json['scriptHourURA_ReversaJsf'].split('|')

        for (let [index, value] of autInf.entries()) {
            if (value.name == 'PHPSESSID') {
                autInf = `PHPSESSID=${value.value}`
                break
            }
        }

        let qtd = 0, stop = false
        while (!stop) {
            qtd++;
            time = dateHour().res;
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `## COMEÇANDO LOOP: ${qtd} ##` });

            // SEG <> SAB | [??:00] <> [??:00]
            if (['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB',].includes(time.dayNam) && (Number(time.hou) > Number(scriptHour[0]) - 1 && Number(time.hou) < Number(scriptHour[1]))) {

                // PEGAR NOVOS LEADS
                let infLeads, retLeads
                infLeads = {
                    'e': e,
                    'aut': autInf,
                    'login': loginInf,
                    'password': passwordInf,
                }
                retLeads = await leadsJsf(infLeads);
                if (!retLeads.ret) {
                    err = `$ [server] FALSE: retLeads`
                    logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` });
                    infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeads }
                    retLog = await log(infLog);
                } else {
                    retLeads = retLeads.res

                    // SÓ RODAR SE O RETORNO DE leads FOR ARRAY
                    if (retLeads instanceof Array) {
                        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${retLeads.length} LEADS` });

                        // PEGAR INF | ALTERAR STATUS | MANDAR PARA PLANILHA
                        for (let [index, value] of retLeads.entries()) {
                            // ### MANDAR PARA PLANILHA
                            time = dateHour().res
                            let sheetSend = [[
                                value.leadId, // LEAD ID
                                `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, // DATA DA CONSULTA
                                `(JSF) ${value.mailing}`,
                                value.date, // DATA URA
                                value.cnpj,
                                value.tel,
                                value.administrador,
                                value.email,
                                value.razaoSocial,
                                `http://200.150.207.26/${value.leadId}`
                            ]]
                            let sheetSendNew = sheetSend[0].join(conSplInf)

                            infGoogleSheets = {
                                'e': e, 'action': 'send',
                                'id': id,
                                'tab': tab,
                                'range': `${colInf}**`,
                                'values': [[`${sheetSendNew}`]]
                            }
                            retGoogleSheets = await googleSheets(infGoogleSheets);
                            if (!retGoogleSheets.ret) {
                                err = `$ [server] FALSE: retGoogleSheets`
                                logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` });
                                infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGoogleSheets }
                                retLog = await log(infLog);
                                return retGoogleSheets
                            }
                            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[${(index + 1).toString().padStart(2, '0')}] ID: ${sheetSend[0][0]} | TEL: ${sheetSend[0][5]} | SHEET OK` });
                            await new Promise(resolve => { setTimeout(resolve, 5 * 1000) }) // SEGUNDOS
                        }
                    }
                    ret['ret'] = true
                    ret['msg'] = `SERVER: OK`
                }
            } else {
                logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `## FORA DO DIA E HORÁRIO (${scriptHour[0]}:00 <> ${scriptHour[1]}:00) ##` });
            }

            time = dateHour().res;
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `## ESPERANDO DELAY PARA O PRÓXIMO LOOP ##` });
            await new Promise(resolve => { setTimeout(resolve, 180 * 1000) }) // SEGUNDOS
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun()


