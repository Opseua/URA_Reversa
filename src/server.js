await import('../../Chrome_Extension/src/resources/@functions.js');

async function server(inf) {
    let ret = { 'ret': false };
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, 'server');

        let qtd = 0, stop = false
        while (!stop) {
            qtd++;
            // PEGAR NOVOS LEADS
            let infLeads, retLeads
            infLeads = { 'aut': false }
            retLeads = await leads(infLeads); if (!retLeads.ret) { console.log('FALSE: retLeads'); return retLeads } else { retLeads = retLeads.res }
            // console.log(retLeads)

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
            retGoogleSheet = await googleSheet(infGoogleSheet); if (!retGoogleSheet.ret) { console.log('FALSE: googleSheet'); return retGoogleSheet } else { retGoogleSheet = retGoogleSheet.res[0][0] }
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
                infLeadGet = { 'aut': false, 'leadId': value.id }
                // retLeadGet = await leadGet(infLeadGet); if (!retLeadGet.ret) { console.log('FALSE: retLeadGet'); return retLeadGet } else { retLeadGet = retLeadGet.res }
                // console.log(retLeads)

                // ALTERAR STATUS DO LEAD
                let infLeadChangeStatus, retLeadChangeStatus
                infLeadChangeStatus = { 'aut': false, 'leadId': value.id }
                retLeadChangeStatus = await leadChangeStatus(infLeadChangeStatus); if (!retLeadChangeStatus.ret) { console.log('FALSE: retLeadChangeStatus'); return retLeadChangeStatus } else { retLeadChangeStatus = retLeadChangeStatus.res }
                console.log(retLeads)

                retLeadGet = {
                    'id': value.id,
                    'date': value.date,
                    'tel': '21988776655',
                    'status': value.status,
                }

                time = dateHour().res
                time = `${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`
                let sheetSend = `${retLeadGet.id}${conSplInf}${time}${conSplInf}${retLeadGet.date}${conSplInf}${retLeadGet.tel}${conSplInf}${retLeadGet.status}`
                infGoogleSheet = {
                    'action': 'send',
                    'id': id,
                    'tab': tab,
                    'range': `D*`,
                    'values': [[`${sheetSend}`]]
                }
                retGoogleSheet = await googleSheet(infGoogleSheet); if (!retGoogleSheet.ret) { console.log('FALSE: googleSheet'); return retGoogleSheet }
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























