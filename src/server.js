await import('./resources/@export.js');
async function server(inf) {
    let ret = { 'ret': false };
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `server [URA_Reversa]`, '\n');

        let qtd = 0, stop = false
        while (!stop) {
            qtd++;
            // PEGAR NOVOS LEADS
            let infLeads, retLeads
            infLeads = { 'aut': false }
            retLeads = await leads(infLeads);
            if (!retLeads.ret) {
                console.log('[server] FALSE retLeads');
                return retLeads
            } else {
                retLeads = retLeads.res
            }

            // PEGAR OS DADOS GLOBAIS E FAZER O PARSE DO JSON
            let infGoogleSheet, retGoogleSheet
            let id = inf && inf.id ? inf.id : '1UgKZbXFa_G3wn1XqVpfphWspSDt1EPrpzH0Trj-eMz4'
            let tab = inf && inf.tab ? inf.tab : 'ATENDIDO_TESTES'
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

            // PEGAR INF DO LEAD E MANDAR PARA A PLANILHA
            for (let [index, value] of retLeads.entries()) {
                // PEGAR INF DO LEAD
                let infLeadGet, retLeadGet
                infLeadGet = { 'aut': false, 'leadId': value.leadId }
                retLeadGet = await leadGet(infLeadGet);
                if (!retLeadGet.ret) {
                    console.log('[server] FALSE retLeadGet');
                    return retLeadGet
                } else {
                    retLeadGet = retLeadGet.res
                }

                // ALTERAR STATUS DO LEAD
                let infLeadChangeStatus, retLeadChangeStatus
                infLeadChangeStatus = { 'aut': false, 'leadId': value.leadId }
                retLeadChangeStatus = await leadChangeStatus(infLeadChangeStatus);
                if (!retLeadChangeStatus.ret) {
                    console.log('[server] FALSE retLeadChangeStatus');
                    return retLeadChangeStatus
                } else {
                    retLeadChangeStatus = retLeadChangeStatus.res
                }

                time = dateHour().res
                let sheetSend = [[
                    value.leadId, // LEAD ID
                    `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, // DATA DA CONSULTA
                    value.date, // DATA URA
                    retLeadGet.tel,
                    retLeadChangeStatus.status,
                ]]
                sheetSend = sheetSend[0].join(conSplInf)

                infGoogleSheet = {
                    'action': 'send',
                    'id': id,
                    'tab': tab,
                    'range': `D*`,
                    'values': [[`${sheetSend}`]]
                }
                retGoogleSheet = await googleSheet(infGoogleSheet);
                if (!retGoogleSheet.ret) {
                    console.log('[server] FALSE retGoogleSheet');
                    return retGoogleSheet
                }
            }
            ret['ret'] = true
            ret['msg'] = `SERVER: OK`
            console.log('LOOP:', qtd)
            await new Promise(resolve => { setTimeout(resolve, 10000) }) // [60000] 1 MINUTO 
        }
        console.log('FIM')
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
}
await server()























