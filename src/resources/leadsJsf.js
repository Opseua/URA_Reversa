// let infLeads, retLeads
// infLeads = {
//     'e': e,
//     'aut': false,
//     'status': [ // 'Retorno realizado' | 'Pendente de retorno' 'Visualizado para retorno'
//         // 'Retorno realizado', // ###### TESTES ######
//         'Pendente de retorno',
//         'Visualizado para retorno',
//     ]
// }
// retLeads = await leads(infLeads); console.log(retLeads)

let e = import.meta.url, ee = e;
async function leadsJsf(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let infApi, retApi, infRegex, retRegex, infLog, retLog, err, time = dateHour().res, infGoogleSheets, retGoogleSheets
        let aut = inf && inf.autJsf ? inf.autJsf : 'aaaa';

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

        // ÚLTIMO LEAD QUE FOI PEGO NO JSF
        let conSplInf = inf && inf.conSpl ? inf.conSpl : gO.inf.json['conSpl'];
        let lastLead = inf && inf.lastLeadURA_ReversaJsf ? inf.lastLeadURA_ReversaJsf : gO.inf.json['lastLeadURA_ReversaJsf'];

        // DATA INICIAL À 5 DIAS ATRÁS
        let timeSta = dateHour(`-${(86400 * 5)}`).res

        let timeEnd = dateHour().res
        let url = `http://200.150.207.26/azcall/relatorio/relTbu.php?dt_inicial=${timeSta.day}/${timeSta.mon}/2024%200:00&dt_final=${timeEnd.day}/${timeEnd.mon}/2024%2023:59&telefone=&telefonetype=1&nome=&camp=&digito=1&nometype=1&Camp\[\]=&&pagina=1&button4=pesquisar`

        // API [LISTA DE LEADS]
        infApi = {
            'e': e, 'method': 'GET', 'url': url,
            'headers': { 'Cookie': aut, }
        };
        retApi = await api(infApi);

        // TESTES
        // let infFile, retFile // 'raw': true,         rewrite TRUE → adicionar no mesmo arquivo
        // infFile = { 'e': e, 'action': 'read', 'functionLocal': false, 'path': "D:/ARQUIVOS/PROJETOS/URA_Reversa/LEADS.txt" }
        // retFile = await file(infFile);
        // retApi = { 'ret': true, 'res': { 'body': retFile.res } }

        if (!retApi.ret || !retApi.res.body.includes('Campanha')) {
            err = `$ [leads] FALSE: retApi 1`
            // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            return ret
        } else {
            retApi = retApi.res.body
        }

        // ## LOG ## retApi
        err = `$ [leads] LOG retApi`
        infLog = { 'e': e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        retLog = await log(infLog); console.log(retLog)

        // PEGAR A TABELA
        infRegex = { 'e': e, 'pattern': `<table(.*?)</table>`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['3']) {
            ret['msg'] = `LEADS JSF: ERRO | NÃO ACHOU A TABELA`;
            err = `$ [leads] ${ret.msg}`
            // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            return ret
        }
        retRegex = `<table${retRegex.res['3']}</table>`

        // HTML → JSON
        let infHtmlToJson, retHtmlToJson
        infHtmlToJson = { 'e': e, 'mode': '2', 'html': retRegex }
        retHtmlToJson = await htmlToJson(infHtmlToJson);
        if (!retHtmlToJson.ret || retHtmlToJson.res.length < 1) {
            err = `$ [leads] FALSE: retHtmlToJson`
            // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            retLog = await log(infLog);
            return retHtmlToJson
        } else {
            retHtmlToJson = JSON.parse(retHtmlToJson.res)
        }

        // ARRAY COM A LISTA DE LEADS
        let leadsNew = []
        if (!retHtmlToJson.length > 0) {
            err = `$ [leads] retHtmlToJson ARRAY VAZIA`
            // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            retLog = await log(infLog);
            return ret
        }

        // ## LOG ## retHtmlToJson
        err = `$ [leads] LOG retHtmlToJson`
        infLog = { 'e': e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
        retLog = await log(infLog);

        // PEGAR LEADS
        let sendLeads = lastLead == 'NADA' ? true : false
        function newLeads() {
            for (let [index, value] of retHtmlToJson.reverse().entries()) {
                // PEGAR O LEAD
                if (sendLeads) {
                    let partes = value.col2.split(' ');
                    let data = partes[0].split('/');
                    let hora = partes[1].split(':');
                    let day = parseInt(data[0], 10).toString().padStart(2, '0');
                    let mon = parseInt(data[1], 10).toString().padStart(2, '0');
                    let yea = parseInt(data[2], 10).toString().padStart(4, '0');;
                    let hou = parseInt(hora[0], 10).toString().padStart(2, '0');
                    let min = parseInt(hora[1], 10).toString().padStart(2, '0');
                    let sec = parseInt(hora[2], 10).toString().padStart(2, '0');
                    data = `${day}/${mon}/${yea} ${hou}:${min}:${sec}`;
                    leadsNew.push({
                        'leadId': `${yea}-${mon}-${day}_${hou}.${min}.${sec}-${value.col4}`,
                        'date': data,
                        'tel': value.col4 ? value.col4 : 'null',
                        'cnpj': value.col5 ? value.col5 : 'null',
                        'razaoSocial': value.col3 ? value.col3 : 'null',
                        'email': 'sem@gmail.com',
                        'administrador': value.col3 ? value.col3 : 'null',
                        'mailing': value.col6 ? value.col6 : 'null',
                    })
                }
                // PERMITIR NOVOS LEADS (MANTER NO FINAL!!!)
                if (lastLead.includes(`${value.col5}${conSplInf}${value.col4}`)) {
                    sendLeads = true
                }
            }
        }
        newLeads()

        // PEGAR TODOS OS LEADS DA PÁGINA (SE NÃO ENCONTRAR O 'lastLead')
        if (leadsNew.length == 0 && !sendLeads) {
            sendLeads = true
            newLeads()
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${leadsNew.length}` });
        }

        // TESTES
        // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${leadsNew}` });
        // return ret

        ret['res'] = leadsNew
        ret['msg'] = `LEADS: OK`
        ret['ret'] = true

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['leadsJsf'] = leadsJsf;
} else { // NODEJS
    global['leadsJsf'] = leadsJsf;
}
