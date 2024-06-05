function startupFun(b, c) { let a = c - b; let s = Math.floor(a / 1000); let m = a % 1000; let f = m.toString().padStart(3, '0'); return `${s}.${f}` }; let startup = new Date();
await import('./resources/@export.js');

let e = import.meta.url, ee = e;
async function serverRun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `**************** SERVER **************** [${startupFun(startup, new Date())}]` })

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
        let autInf = inf && inf.aut ? inf.aut : gO.inf.json['autUra'];
        let conSplInf = inf && inf.conSpl ? inf.conSpl : gO.inf.json['conSpl'];
        let loginInf = inf && inf.login ? inf.login : gO.inf.json['login'];
        let passwordInf = inf && inf.password ? inf.password : gO.inf.json['password'];
        let interfaceInf = inf && inf.interface ? inf.interface : gO.inf.json['interface'];
        let id_interfaceInf = inf && inf.id_interface ? inf.id_interface : gO.inf.json['id_interface'];
        let subatualInf = inf && inf.subatual ? inf.subatual : gO.inf.json['subatual'];
        let scriptHour = inf && inf.scriptHour ? inf.scriptHour.split('|') : gO.inf.json['scriptHourURA_Reversa'].split('|')

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
                    'interface': interfaceInf,
                    'id_interface': id_interfaceInf,
                    'subatual': subatualInf,
                    'status': [
                        // 'Retorno realizado', // **************************** TESTES ****************************
                        'Pendente de retorno',
                        'Visualizado para retorno',
                    ]
                }
                retLeads = await leads(infLeads);
                if (!retLeads.ret) {
                    err = `$ [server] FALSE: retLeads`
                    logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` });
                    infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeads }
                    retLog = await log(infLog);
                } else {
                    retLeads = retLeads.res

                    // SÓ RODAR SE O RETORNO DE leads FOR ARRAY
                    if (retLeads instanceof Array) {
                        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${retLeads.length} LEADS COM O STATUS: '${infLeads.status}'` });

                        // PEGAR INF | ALTERAR STATUS | MANDAR PARA PLANILHA
                        for (let [index, value] of retLeads.entries()) {
                            // ### PEGAR INF
                            let infLeadGet, retLeadGet
                            infLeadGet = { 'e': e, 'aut': autInf, 'leadId': value.leadId }
                            retLeadGet = await leadGet(infLeadGet);
                            if (!retLeadGet.ret) {
                                err = `$ [server] FALSE: retLeadGet`
                                logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` });
                                infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeadGet }
                                retLog = await log(infLog);
                            } else {
                                retLeadGet = retLeadGet.res
                                // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `LEAD ID: ${value.leadId} | TELEFONE: ${retLeadGet.tel}` });

                                // ###  ALTERAR STATUS
                                let infLeadChangeStatus, retLeadChangeStatus
                                infLeadChangeStatus = { 'e': e, 'aut': autInf, 'leadId': value.leadId, 'status': '1' } // '4' → Inapto | '1' → Venda Realizada
                                retLeadChangeStatus = await leadChangeStatus(infLeadChangeStatus);
                                if (!retLeadChangeStatus.ret) {
                                    // if (!retLeadGet) { // →  TESTE
                                    err = `$ [server] FALSE: retLeadChangeStatus`
                                    logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` });
                                    infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeadChangeStatus }
                                    retLog = await log(infLog);
                                } else {
                                    retLeadChangeStatus = retLeadChangeStatus.res

                                    // ### MANDAR PARA PLANILHA
                                    time = dateHour().res
                                    let sheetSend = [[
                                        value.leadId, // LEAD ID
                                        `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, // DATA DA CONSULTA
                                        value.mailing,
                                        value.date, // DATA URA
                                        retLeadGet.cnpj,
                                        retLeadGet.tel,
                                        retLeadGet.administrador,
                                        retLeadGet.email,
                                        retLeadGet.razaoSocial,
                                        `https://interface.telein.com.br/index.php?link=247&id_contato=${value.leadId}`
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
                                }
                            }
                        }
                    }
                    ret['ret'] = true
                    ret['msg'] = `SERVER: OK`
                }
            } else {
                logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `## FORA DO DIA E HORÁRIO (${scriptHour[0]}:00 <> ${scriptHour[1]}:00) ##` });
            }

            time = dateHour().res;
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `## ESPERANDO DELAY PARA O PRÓXIMO LOOP ##` })
            await new Promise(resolve => { setTimeout(resolve, 300000) }) // [60000] 1 MINUTO [300000] 5 MINUTOS
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
        ret['msg'] = retRegexE.res
    };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun()


