await import('./resources/@export.js');
let e = import.meta.url;
async function server(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (err, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': err, 'inf': inf, 'catchGlobal': true }) } }
        if (typeof window !== 'undefined') { window.addEventListener('error', (err) => errs(err, ret)); window.addEventListener('unhandledrejection', (err) => errs(err, ret)) }
        else { process.on('uncaughtException', (err) => errs(err, ret)); process.on('unhandledRejection', (err) => errs(err, ret)) }
    }
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `server [URA_Reversa]`, '\n');

        let infLog, retLog, infGoogleSheet, retGoogleSheet, err

        // DADOS GLOBAIS DA PLANILHA E FAZER O PARSE
        gO.inf['id'] = '1UgKZbXFa_G3wn1XqVpfphWspSDt1EPrpzH0Trj-eMz4'; gO.inf['tab'] = 'ATENDIDO';
        let range = 'A2', id = gO.inf.id, tab = gO.inf.tab
        infGoogleSheet = {
            'action': 'get',
            'id': id,
            'tab': tab,
            'range': range,
        }
        retGoogleSheet = await googleSheet(infGoogleSheet);
        if (!retGoogleSheet.ret) {
            err = `[server] Erro ao pegar dados para planilha`
            console.log(err);
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGoogleSheet }
            retLog = await log(infLog);
            return retGoogleSheet
        } else {
            retGoogleSheet = retGoogleSheet.res[0][0]
        }
        gO.inf['json'] = JSON.parse(retGoogleSheet)
        let colInf = inf && inf.col ? inf.col : gO.inf.json['col'];
        let autInf = inf && inf.aut ? inf.aut : gO.inf.json['aut'];
        let conSplInf = inf && inf.conSpl ? inf.conSpl : gO.inf.json['conSpl'];
        let loginInf = inf && inf.login ? inf.login : gO.inf.json['login'];
        let passwordInf = inf && inf.password ? inf.password : gO.inf.json['password'];
        let interfaceInf = inf && inf.interface ? inf.interface : gO.inf.json['interface'];
        let id_interfaceInf = inf && inf.id_interface ? inf.id_interface : gO.inf.json['id_interface'];
        let subatualInf = inf && inf.subatual ? inf.subatual : gO.inf.json['subatual'];

        let qtd = 0, stop = false
        while (!stop) {
            qtd++;
            time = dateHour().res;
            console.log(`\n${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec} ## COMEÇANDO LOOP: ${qtd} ##`)

            // SEG <> SAB | 08H <> 19H
            if (['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB',].includes(time.dayNam) && (Number(time.hou) > 7 & Number(time.hou) < 20)) {

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
                    err = `[server] FALSE: retLeads`
                    console.log(err);
                    infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeads }
                    retLog = await log(infLog);
                    return retLeads
                } else {
                    retLeads = retLeads.res
                }

                // SÓ RODAR SE O RETORNO DE leads FOR ARRAY
                if (retLeads instanceof Array) {
                    console.log(`${retLeads.length} LEADS COM O STATUS: '${infLeads.status}'`)

                    // PEGAR INF | ALTERAR STATUS | MANDAR PARA PLANILHA

                    for (let [index, value] of retLeads.entries()) {
                        // ### PEGAR INF
                        let infLeadGet, retLeadGet
                        infLeadGet = { 'e': e, 'aut': autInf, 'leadId': value.leadId }
                        retLeadGet = await leadGet(infLeadGet);
                        if (!retLeadGet.ret) {
                            err = `[server] FALSE: retLeadGet`
                            console.log(err);
                            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeadGet }
                            retLog = await log(infLog);
                            return retLeadGet
                        } else {
                            retLeadGet = retLeadGet.res
                        }
                        // console.log(`LEAD ID: ${value.leadId} | TELEFONE: ${retLeadGet.tel}`)

                        // ###  ALTERAR STATUS
                        let infLeadChangeStatus, retLeadChangeStatus
                        infLeadChangeStatus = { 'e': e, 'aut': autInf, 'leadId': value.leadId, 'status': '1' } // '4' → Inapto | '1' → Venda Realizada
                        retLeadChangeStatus = await leadChangeStatus(infLeadChangeStatus);
                        if (!retLeadChangeStatus.ret) {
                            err = `[server] FALSE: retLeadChangeStatus`
                            console.log(err);
                            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLeadChangeStatus }
                            retLog = await log(infLog);
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
                            `https://interface.telein.com.br/index.php?link=247&id_contato=${value.leadId}`
                        ]]
                        let sheetSendNew = sheetSend[0].join(conSplInf)

                        // console.log(sheetSendNew)
                        // process.exit()

                        infGoogleSheet = {
                            'action': 'send',
                            'id': id,
                            'tab': tab,
                            'range': `${colInf}**`,
                            'values': [[`${sheetSendNew}`]]
                        }
                        retGoogleSheet = await googleSheet(infGoogleSheet);
                        if (!retGoogleSheet.ret) {
                            err = `[server] FALSE: retGoogleSheet`
                            console.log(err);
                            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGoogleSheet }
                            retLog = await log(infLog);
                            return retGoogleSheet
                        }
                        console.log(`[${(index + 1).toString().padStart(2, '0')}] ID: ${sheetSend[0][0]} | NOVO STATUS: '${sheetSend[0][2]}' | TEL: ${sheetSend[0][7]} | SHEET OK `)
                    }
                }
                ret['ret'] = true
                ret['msg'] = `SERVER: OK`
            } else {
                console.log(`\n${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec} ## FORA DO DIA E HORÁRIO ##`)
            }

            time = dateHour().res;
            console.log(`\n${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec} ## ESPERANDO DELAY PARA O PRÓXIMO LOOP ##`)
            await new Promise(resolve => { setTimeout(resolve, 300000) }) // [60000] 1 MINUTO [300000] 5 MINUTOS
        }
        console.log('FIM')
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
}
await server()




