globalThis['currentFile'] = function () { return new Error().stack.match(/([^ \n])*([a-z]*:\/\/\/?)*?[a-z0-9\/\\]*\.js/ig)?.[0].replace(/[()]/g, ''); }; globalThis['sP'] = currentFile(); let startup = new Date();
await import('./resources/@export.js'); let e = sP, ee = e;

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        await logConsole({ e, ee, 'txt': `**************** SERVER **************** [${startupTime(startup, new Date())}]`, });

        // DADOS GLOBAIS DA PLANILHA E FAZER O PARSE
        let retGooShee, err, time, id = '1wEiSgZHeaUjM6Gl1Y67CZZZ7UTsDweQhRYKqaTu3_I8', tab = 'INF'; retGooShee = await googleSheets({ e, 'action': 'get', id, tab, 'range': 'A2', }); if (!retGooShee.ret) {
            err = `$ Erro ao pegar-enviar dados para planilha`; logConsole({ e, ee, 'txt': `${err}`, }); await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGooShee, }); return retGooShee;
        } else { retGooShee = retGooShee.res[0][0]; } let json = JSON.parse(retGooShee)['URA_REVERSA']; let retLeads, outHour;
        let { range, lastLeadRange, lastLead, scriptHour, aut, } = json; scriptHour = scriptHour.split('|'); aut = JSON.parse(aut.replace(/\|/g, '"'));
        for (let [index, value,] of aut.entries()) { if (value.name === 'PHPSESSID') { aut = `PHPSESSID=${value.value}`; break; } }

        async function keepRunning() {
            // let rGS = await googleSheets({ e, action: 'send', id, tab: `INDICAR_AUTOMATICO`, range: `A130`, values: [[`${dateHour().res.tim} | Rodando: serverJsf`,],], });
            // if (!rGS.ret) { err = `$ Erro ao pegar-enviar dados para planilha`; logConsole({ e, ee, 'txt': `${err}`, }); await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': rGS, }); }
        }

        let qtd = 0, stop = false; while (!stop) {
            time = dateHour().res; let a = time.dayNam; let b = Number(time.hou); let c = Number(scriptHour[0] - 1); let d = Number(scriptHour[1]); qtd++; logConsole({ e, ee, 'txt': `## COMEÇANDO LOOP: ${qtd} ##`, });

            keepRunning(); // MANTER O STATUS 'RODANDO' NA PLANILHA

            if (!((['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB',].includes(a) && (b > c && b < d)))) {
                logConsole({ e, ee, 'txt': `## FORA DO DIA E HORÁRIO (${scriptHour[0]}:00 <> ${scriptHour[1]}:00) ##`, }); outHour = true;
            } else {
                // (SEG <> SEX → [09:00] <> [19:00]) PEGAR NOVOS LEADS
                outHour = false; retLeads = await leadsJsf({ e, aut, lastLead, });
                if (!retLeads.ret) { err = `% [server] FALSE: retLeads`; logConsole({ e, ee, 'txt': `${err}`, }); await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeads, }); } else {
                    retLeads = retLeads.res;

                    // SÓ RODAR SE O RETORNO DE leads FOR ARRAY
                    if (Array.isArray(retLeads)) {
                        logConsole({ e, ee, 'txt': `${retLeads.length === 0 ? 'NENHUM LEAD PENDENTE' : `ENVIANDO ${retLeads.length} LEAD(s) PARA PARA A PLANILHA`}`, }); await new Promise(r => { setTimeout(r, 3 * 1000); });

                        // PEGAR INF | ALTERAR STATUS | MANDAR PARA PLANILHA
                        for (let [index, value,] of retLeads.entries()) {
                            time = dateHour().res; let sheetSend = [[
                                `(JSF) ${value.mailing}`, // MAILING
                                value.data, // DATA URA
                                value.cnpj,
                                value.tel,
                                value.razaoSocial,
                                value.email,
                            ],];

                            // ### MANDAR PARA PLANILHA [LEAD]
                            retGooShee = await googleSheets({ e, 'action': 'addLines', id, 'tab': 'URA_REVERSA', 'values': sheetSend, }); if (!retGooShee.ret) {
                                err = `% [server] FALSE: retGoogleSheets`; logConsole({ e, ee, 'txt': `${err}`, });
                                await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGooShee, }); return retGooShee;
                            } let text = `${(index + 1).toString().padStart(2, '0')}/${(retLeads.length).toString().padStart(2, '0')}`;
                            logConsole({ e, ee, 'txt': `[${text}] ID: ${value.leadId} | TEL: ${value.tel} | SHEET OK`, });

                            // ### MANDAR PARA PLANILHA DE LIMPEZA
                            await googleSheets({ e, 'action': 'addLines', 'id': '19ta_pkl5VIurrhhEg598oOZAE11HIS4PMJx8uowXCJY', 'tab': 'AUTOMATICO', 'values': [[`${value.cnpj}`,],], });

                            // ### REGISTRAR NA PLANILHA [LEAD ATUAL (QUE SERÁ O ÚLTIMO)]
                            lastLead = `${value.cnpj}_${value.tel}`; retGooShee = await googleSheets({ e, 'action': 'send', id, tab, 'range': lastLeadRange, 'values': [[`${lastLead}`,],], }); if (!retGooShee.ret) {
                                err = `% [server] FALSE: retGoogleSheets`; logConsole({ e, ee, 'txt': `${err}`, });
                                await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGooShee, }); return retGooShee;
                            }

                            keepRunning(); // MANTER O STATUS 'RODANDO' NA PLANILHA

                            await new Promise(r => { setTimeout(r, 5 * 1000); }); // SEGUNDOS
                        }

                    }
                    ret['ret'] = true;
                    ret['msg'] = `SERVER: OK`;
                }
            }

            // MANDAR STATUS PARA A PLANILHA
            retGooShee = await googleSheets({ e, 'action': 'send', id, tab, range, 'values': [[`${Math.floor(Date.now() / 1000)} | ${outHour ? 'Fora do dia e horário' : `Novos leads: ${retLeads.length}`}`,],], });
            if (!retGooShee.ret) {
                err = `% [server] FALSE: retGoogleSheets`; logConsole({ e, ee, 'txt': `${err}`, });
                await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGooShee, }); return retGooShee;
            }

            logConsole({ e, ee, 'txt': `## ESPERANDO DELAY PARA O PRÓXIMO LOOP ##`, }); await new Promise(r => { setTimeout(r, 180 * 1000); }); // SEGUNDOS
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


