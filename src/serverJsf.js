let startup = new Date(); await import('./resources/@export.js'); let e = import.meta.url, ee = e;

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ e, ee, 'msg': `**************** SERVER **************** [${startupTime(startup, new Date())}]`, });

        let retGoogleSheets, err, time;

        // DADOS GLOBAIS DA PLANILHA E FAZER O PARSE
        gO.inf['id'] = '1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc'; gO.inf['tab'] = 'INDICAR_AUTOMATICO'; let range = 'A2', id = gO.inf.id, tab = gO.inf.tab;
        retGoogleSheets = await googleSheets({ e, 'action': 'get', id, tab, range, }); if (!retGoogleSheets.ret) {
            err = `$ Erro ao pegar-enviar dados para planilha`; logConsole({ e, ee, 'msg': `${err}`, });
            await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGoogleSheets, }); return retGoogleSheets;
        } else { retGoogleSheets = retGoogleSheets.res[0][0]; }
        gO.inf['json'] = JSON.parse(retGoogleSheets); let colInf = inf && inf.col ? inf.col : gO.inf.json['colUra']; let autInf = inf && inf.autJsf ? inf.autJsf : gO.inf.json['autUraJsf'];
        let conSplInf = inf && inf.conSpl ? inf.conSpl : gO.inf.json['conSpl']; let loginInf = inf && inf.loginJsf ? inf.loginJsf : gO.inf.json['loginJsf'];
        let passwordInf = inf && inf.passwordJsf ? inf.passwordJsf : gO.inf.json['passwordJsf'];
        let scriptHour = inf && inf.scriptHourJsf ? inf.scriptHourJsf.split('|') : gO.inf.json['scriptHourURA_ReversaJsf'].split('|');

        for (let [index, value,] of autInf.entries()) { if (value.name === 'PHPSESSID') { autInf = `PHPSESSID=${value.value}`; break; } }

        async function keepRunning() {
            // let rGS = await googleSheets({ e, action: 'send', id: `1wEiSgZHeaUjM6Gl1Y67CZZZ7UTsDweQhRYKqaTu3_I8`, tab: `INDICAR_AUTOMATICO`, range: `A130`, values: [[`${dateHour().res.tim} | Rodando: serverJsf`,],], });
            // if (!rGS.ret) { err = `$ Erro ao pegar-enviar dados para planilha`; logConsole({ e, ee, 'msg': `${err}`, }); await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': rGS, }); }
        }

        let qtd = 0, stop = false; while (!stop) {
            time = dateHour().res; let a = time.dayNam; let b = Number(time.hou); let c = Number(scriptHour[0] - 1); let d = Number(scriptHour[1]); qtd++; logConsole({ e, ee, 'msg': `## COMEÇANDO LOOP: ${qtd} ##`, });

            keepRunning(); // MANTER O STATUS 'RODANDO' NA PLANILHA

            if (!((['SEG', 'TER', 'QUA', 'QUI', 'SEX',].includes(a) && (b > c && b < d)) || (['SAaaa',].includes(a) && (b > c && b < d - 7)))) {
                logConsole({ e, ee, 'msg': `## FORA DO DIA E HORÁRIO (${scriptHour[0]}:00 <> ${scriptHour[1]}:00) ##`, });
            } else {
                // (SEG <> SEX → [09:00] <> [19:00]) PEGAR NOVOS LEADS
                let retLeads = await leadsJsf({ e, 'aut': autInf, 'login': loginInf, 'password': passwordInf, });
                if (!retLeads.ret) { err = `% [server] FALSE: retLeads`; logConsole({ e, ee, 'msg': `${err}`, }); await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeads, }); } else {
                    retLeads = retLeads.res;

                    // SÓ RODAR SE O RETORNO DE leads FOR ARRAY
                    if (Array.isArray(retLeads)) {
                        logConsole({ e, ee, 'msg': `${retLeads.length === 0 ? 'NENHUM LEAD PENDENTE' : `ENVIANDO ${retLeads.length} LEAD(s) PARA PARA A PLANILHA`}`, });
                        await new Promise(resolve => { setTimeout(resolve, 3 * 1000); });

                        // PEGAR INF | ALTERAR STATUS | MANDAR PARA PLANILHA
                        for (let [index, value,] of retLeads.entries()) {
                            let dateNow = `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`; time = dateHour().res; let sheetSend = [[
                                value.leadId, // LEAD ID
                                dateNow, // DATA DA CONSULTA
                                `(JSF) ${value.mailing}`,
                                value.data, // DATA URA
                                value.cnpj,
                                value.tel,
                                value.administrador,
                                value.email,
                                value.razaoSocial,
                                `http://177.87.122.53/${value.leadId}`,
                            ],]; let sheetSendNew = sheetSend[0].join(conSplInf); let currentLead = `${value.leadId}${conSplInf}${value.cnpj}${conSplInf}${value.tel}`;


                            // console.log(`${currentLead}\n`); crashCode();


                            // ### MANDAR PARA PLANILHA [LEAD]
                            retGoogleSheets = await googleSheets({ e, 'action': 'send', id, tab, 'range': `${colInf}*`, 'values': [[`${sheetSendNew}`,],], }); if (!retGoogleSheets.ret) {
                                err = `% [server] FALSE: retGoogleSheets`; logConsole({ e, ee, 'msg': `${err}`, });
                                await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGoogleSheets, }); return retGoogleSheets;
                            } let text = `${(index + 1).toString().padStart(2, '0')}/${(retLeads.length).toString().padStart(2, '0')}`;
                            logConsole({ e, ee, 'msg': `[${text}] ID: ${sheetSend[0][0]} | TEL: ${sheetSend[0][5]} | SHEET OK`, });

                            // ### REGISTRAR NA PLANILHA [LEAD ATUAL (QUE SERÁ O ÚLTIMO)]
                            retGoogleSheets = await googleSheets({ e, 'action': 'send', id, tab, 'range': `A74`, 'values': [[`${currentLead}`,],], }); if (!retGoogleSheets.ret) {
                                err = `% [server] FALSE: retGoogleSheets`; logConsole({ e, ee, 'msg': `${err}`, });
                                await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGoogleSheets, }); return retGoogleSheets;
                            }

                            keepRunning(); // MANTER O STATUS 'RODANDO' NA PLANILHA

                            await new Promise(resolve => { setTimeout(resolve, 5 * 1000); }); // SEGUNDOS
                        }
                    }
                    ret['ret'] = true;
                    ret['msg'] = `SERVER: OK`;
                }
            }

            logConsole({ e, ee, 'msg': `## ESPERANDO DELAY PARA O PRÓXIMO LOOP ##`, });
            await new Promise(resolve => { setTimeout(resolve, 180 * 1000); }); // SEGUNDOS
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


