let startup = new Date(); globalThis['sP'] = import.meta.url; await import('./resources/@export.js'); let e = sP, ee = e;

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        await logConsole({ e, ee, 'txt': `**************** SERVER **************** [${startupTime(startup, new Date())}]`, });

        let infLog, infGoogleSheets, retGoogleSheets, err, time;

        // DADOS GLOBAIS DA PLANILHA E FAZER O PARSE
        gO.inf['id'] = '1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc'; gO.inf['tab'] = 'INDICAR_AUTOMATICO';
        let range = 'A2', id = gO.inf.id, tab = gO.inf.tab;
        retGoogleSheets = await googleSheets({ e, 'action': 'get', id, tab, range, });
        if (!retGoogleSheets.ret) {
            err = `$ Erro ao pegar-enviar dados para planilha`;
            logConsole({ e, ee, 'txt': `${err}`, });
            await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGoogleSheets, });
            return retGoogleSheets;
        } else {
            retGoogleSheets = retGoogleSheets.res[0][0];
        }
        gO.inf['json'] = JSON.parse(retGoogleSheets);
        let colInf = inf && inf.col ? inf.col : gO.inf.json['colUra'];
        let autInf = inf && inf.aut ? inf.aut : gO.inf.json['autUra'];
        let conSplInf = inf && inf.conSpl ? inf.conSpl : gO.inf.json['conSpl'];
        let loginInf = inf && inf.login ? inf.login : gO.inf.json['login'];
        let passwordInf = inf && inf.password ? inf.password : gO.inf.json['password'];
        let interfaceInf = inf && inf.interface ? inf.interface : gO.inf.json['interface'];
        let idInterfaceInf = inf && inf.id_interface ? inf.id_interface : gO.inf.json['id_interface'];
        let subatualInf = inf && inf.subatual ? inf.subatual : gO.inf.json['subatual'];
        let scriptHour = inf && inf.scriptHour ? inf.scriptHour.split('|') : gO.inf.json['scriptHourURA_Reversa'].split('|');

        for (let [index, value,] of autInf.entries()) {
            if (value.name === 'PHPSESSID') {
                autInf = `PHPSESSID=${value.value}`;
                break;
            }
        }

        let qtd = 0, stop = false;
        while (!stop) {
            qtd++;
            time = dateHour().res;
            logConsole({ e, ee, 'txt': `## COMEÇANDO LOOP: ${qtd} ##`, });

            // SEG <> SAB | [??:00] <> [??:00]
            if (['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB',].includes(time.dayNam) && (Number(time.hou) > Number(scriptHour[0]) - 1 && Number(time.hou) < Number(scriptHour[1]))) {

                // PEGAR NOVOS LEADS
                let infLeads, retLeads;
                infLeads = {
                    e,
                    'aut': autInf,
                    'login': loginInf,
                    'password': passwordInf,
                    'interface': interfaceInf,
                    'id_interface': idInterfaceInf,
                    'subatual': subatualInf,
                    'status': [
                        // 'Retorno realizado', // **************************** TESTES ****************************
                        'Pendente de retorno',
                        'Visualizado para retorno',
                    ],
                };
                retLeads = await leads(infLeads);
                if (!retLeads.ret) {
                    err = `% [server] FALSE: retLeads`;
                    logConsole({ e, ee, 'txt': `${err}`, });
                    await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeads, });
                } else {
                    retLeads = retLeads.res;

                    // SÓ RODAR SE O RETORNO DE leads FOR ARRAY
                    if (Array.isArray(retLeads)) {
                        logConsole({ e, ee, 'txt': `${retLeads.length} LEADS COM O STATUS: '${infLeads.status}'`, });

                        // PEGAR INF | ALTERAR STATUS | MANDAR PARA PLANILHA
                        for (let [index, value,] of retLeads.entries()) {
                            // ### PEGAR INF
                            let retLeadGet = await leadGet({ e, 'aut': autInf, 'leadId': value.leadId, });
                            if (!retLeadGet.ret) {
                                err = `% [server] FALSE: retLeadGet`;
                                logConsole({ e, ee, 'txt': `${err}`, });
                                await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeadGet, });
                            } else {
                                retLeadGet = retLeadGet.res;
                                // logConsole({ e, ee, 'txt': `LEAD ID: ${value.leadId} | TELEFONE: ${retLeadGet.tel}` });

                                // ###  ALTERAR STATUS
                                let retLeadChangeStatus = await leadChangeStatus({ e, 'aut': autInf, 'leadId': value.leadId, 'status': '1', }); // '4' → Inapto | '1' → Venda Realizada
                                if (!retLeadChangeStatus.ret) {
                                    // if (!retLeadGet) { // →  TESTE
                                    err = `% [server] FALSE: retLeadChangeStatus`;
                                    logConsole({ e, ee, 'txt': `${err}`, });
                                    infLog = { e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeadChangeStatus, };
                                    await log(infLog);
                                } else {
                                    retLeadChangeStatus = retLeadChangeStatus.res;

                                    // ### MANDAR PARA PLANILHA
                                    time = dateHour().res;
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
                                        `https://interface.telein.com.br/index.php?link=247&id_contato=${value.leadId}`,
                                    ],];
                                    let sheetSendNew = sheetSend[0].join(conSplInf);

                                    infGoogleSheets = {
                                        e, 'action': 'send',
                                        id,
                                        tab,
                                        'range': `${colInf}*`,
                                        'values': [[`${sheetSendNew}`,],],
                                    };
                                    retGoogleSheets = await googleSheets(infGoogleSheets);
                                    if (!retGoogleSheets.ret) {
                                        err = `% [server] FALSE: retGoogleSheets`;
                                        logConsole({ e, ee, 'txt': `${err}`, });
                                        infLog = { e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGoogleSheets, };
                                        await log(infLog);
                                        return retGoogleSheets;
                                    }
                                    logConsole({ e, ee, 'txt': `[${(index + 1).toString().padStart(2, '0')}] ID: ${sheetSend[0][0]} | TEL: ${sheetSend[0][5]} | SHEET OK`, });
                                }
                            }
                        }
                    }
                    ret['ret'] = true;
                    ret['msg'] = `SERVER: OK`;
                }
            } else {
                logConsole({ e, ee, 'txt': `## FORA DO DIA E HORÁRIO (${scriptHour[0]}:00 <> ${scriptHour[1]}:00) ##`, });
            }

            time = dateHour().res;
            logConsole({ e, ee, 'txt': `## ESPERANDO DELAY PARA O PRÓXIMO LOOP ##`, });
            await new Promise(r => { setTimeout(r, 300000); }); // [60000] 1 MINUTO [300000] 5 MINUTOS
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


