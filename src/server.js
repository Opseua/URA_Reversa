async function server(inf) {
    await import('./resources/@export.js');
    let ret = { 'ret': false };
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `server [URA_Reversa]`, '\n');

        let infConfigStorage, retConfigStorage
        // PEGAR O AUT DO CONFIG
        infConfigStorage = { 'action': 'get', 'functionLocal': false, 'key': 'telein' } // 'functionLocal' SOMENTE NO NODEJS
        retConfigStorage = await configStorage(infConfigStorage);
        if (!retConfigStorage.ret) {
            console.log('[server] FALSE: retConfigStorage');
            return retConfigStorage
        } else {
            retConfigStorage = retConfigStorage.res
        }
        let aut = inf && inf.aut ? inf.aut : retConfigStorage.aut

        let qtd = 0, stop = false
        while (!stop) {
            qtd++;
            time = dateHour().res;
            console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec} ## COMEÇANDO LOOP: ${qtd} ##`)
            // PEGAR NOVOS LEADS
            let infLeads, retLeads
            infLeads = {
                // 'logFun': true,
                'aut': aut,
                'status': [ // 'Retorno realizado' | 'Pendente de retorno' 'Visualizado para retorno'
                    'Retorno realizado', // ###### TESTES ######
                    'Pendente de retorno',
                    'Visualizado para retorno',
                ]
            }
            retLeads = await leads(infLeads);
            if (!retLeads.ret) {
                console.log('[server] FALSE retLeads');
                return retLeads
            } else {
                retLeads = retLeads.res
            }

            // SÓ RODAR SE O RETORNO DE leads FOR ARRAY
            if (retLeads instanceof Array) {
                console.log(`${retLeads.length} LEADS COM O STATUS: '${infLeads.status}'`)

                // PEGAR OS DADOS GLOBAIS E FAZER O PARSE DO JSON
                let infGoogleSheet, retGoogleSheet
                let id = inf && inf.id ? inf.id : '1UgKZbXFa_G3wn1XqVpfphWspSDt1EPrpzH0Trj-eMz4'
                let tab = inf && inf.tab ? inf.tab : 'ATENDIDO'
                infGoogleSheet = {
                    'action': 'get',
                    'id': id,
                    'tab': tab,
                    'range': `A2`,
                }
                retGoogleSheet = await googleSheet(infGoogleSheet);
                if (!retGoogleSheet.ret) {
                    console.log('[server] FALSE retGoogleSheet');
                    return retGoogleSheet
                } else {
                    retGoogleSheet = retGoogleSheet.res[0][0]
                }
                let json = JSON.parse(retGoogleSheet);
                let range = inf && inf.range ? inf.range : json['range'];
                let status1Range = inf && inf.status1Range ? inf.status1Range : range["status1"];
                let status2Range = inf && inf.status2Range ? inf.status2Range : range["status2"];
                let autRange = inf && inf.autRange ? inf.autRange : range["aut"];
                let colInf = inf && inf.colInf ? inf.colInf : json['col'];
                let autInf = inf && inf.autInf ? inf.autInf : json['aut'];
                let conSplInf = inf && inf.conSplInf ? inf.conSplInf : json['conSpl'];

                // PEGAR INF | ALTERAR STATUS | MANDAR PARA PLANILHA

                for (let [index, value] of retLeads.entries()) {
                    // ### PEGAR INF
                    let infLeadGet, retLeadGet
                    infLeadGet = { 'aut': aut, 'leadId': value.leadId }
                    retLeadGet = await leadGet(infLeadGet);
                    if (!retLeadGet.ret) {
                        console.log('[server] FALSE retLeadGet');
                        return retLeadGet
                    } else {
                        retLeadGet = retLeadGet.res
                    }
                    // console.log(`LEAD ID: ${value.leadId} | TELEFONE: ${retLeadGet.tel}`)

                    // ###  ALTERAR STATUS
                    let infLeadChangeStatus, retLeadChangeStatus
                    infLeadChangeStatus = { 'aut': aut, 'leadId': value.leadId, 'status': '1' } // '4' → Inapto | '1' → Venda Realizada
                    retLeadChangeStatus = await leadChangeStatus(infLeadChangeStatus);
                    if (!retLeadChangeStatus.ret) {
                        console.log('[server] FALSE retLeadChangeStatus');
                        return retLeadChangeStatus
                    } else {
                        retLeadChangeStatus = retLeadChangeStatus.res
                    }
                    // console.log(`LEAD ID: ${value.leadId} | STATUS ALTERADO PARA: ${infLeadChangeStatus.status}`)

                    // ### MANDAR PARA PLANILHA
                    time = dateHour().res
                    let sheetSend = [[
                        value.leadId, // LEAD ID
                        `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, // DATA DA CONSULTA
                        retLeadChangeStatus.status, // STATUS URA
                        value.mailing,
                        value.date, // DATA URA
                        retLeadGet.cnpj,
                        retLeadGet.razaoSocial,
                        retLeadGet.tel,
                        retLeadGet.email,
                        retLeadGet.administrador,
                    ]]
                    let sheetSendNew = sheetSend[0].join(conSplInf)

                    // stop = true
                    // console.log(sheetSendNew)
                    // return

                    infGoogleSheet = {
                        'action': 'send',
                        'id': id,
                        'tab': tab,
                        'range': `D**`,
                        'values': [[`${sheetSendNew}`]]
                    }
                    retGoogleSheet = await googleSheet(infGoogleSheet);
                    if (!retGoogleSheet.ret) {
                        console.log('[server] FALSE retGoogleSheet');
                        return retGoogleSheet
                    }
                    console.log(`[${(index + 1).toString().padStart(2, '0')}] ID: ${sheetSend[0][0]} | TEL: ${sheetSend[0][6]} | NOVO STATUS: '${sheetSend[0][2]}' | SHEET OK`)
                }
            }
            ret['ret'] = true
            ret['msg'] = `SERVER: OK`
            time = dateHour().res;
            console.log(`\n${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec} ## ESPERNANDO 1 MINUTO PARA O PRÓXIMO LOOP ##`)
            await new Promise(resolve => { setTimeout(resolve, 60000) }) // [60000] 1 MINUTO 
        }
        console.log('FIM')
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
}
await server()




