// let infLeads, retLeads // 'logFun': true,
// infLeads = {
//     'e': e,
//     'aut': false,
//     'status': [ // 'Retorno realizado' | 'Pendente de retorno' 'Visualizado para retorno'
//         // 'Retorno realizado', // ###### TESTES ######
//         'Pendente de retorno',
//         'Visualizado para retorno',
//     ]
// }
// retLeads = await leads(infLeads);
// console.log(retLeads)

let e = import.meta.url, ee = e
async function leadsJsf(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let infApi, retApi, infRegex, retRegex, infLog, retLog, err, time = dateHour().res, infGoogleSheets, retGoogleSheets
        let aut = inf && inf.autJsf ? inf.autJsf : 'aaaa';
        let loginOk = inf && inf.loginJsf ? inf.loginJsf : 'aaaa';
        let password = inf && inf.passwordJsf ? inf.passwordJsf : 'aaaa';


        // DADOS GLOBAIS DA PLANILHA E FAZER O PARSE
        gO.inf['id'] = '1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc'; gO.inf['tab'] = 'INDICAR_AUTOMATICO_[TELEIN]';
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
            console.log(err);
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
        let timeSta = dateHour(-(86400 * 5)).res
        let timeEnd = dateHour().res
        let url = `http://200.150.207.26/azcall/relatorio/relTbu.php?dt_inicial=${timeSta.day}/${timeSta.mon}/2024%200:00&dt_final=${timeEnd.day}/${timeEnd.mon}/2024%2023:59&telefone=&telefonetype=1&nome=&camp=&digito=1&nometype=1&Camp\[\]=&&pagina=1&button4=pesquisar`

        // API [LISTA DE LEADS]
        infApi = {
            'e': e, 'method': 'GET', 'url': url,
            'headers': { 'Cookie': aut, }
        };
        // retApi = await api(infApi);


        // TESTES
        let infFile, retFile // 'logFun': true, 'raw': true,         rewrite TRUE → adicionar no mesmo arquivo
        infFile = { 'e': e, 'action': 'read', 'functionLocal': false, 'path': "D:/ARQUIVOS/PROJETOS/URA_Reversa/LEADS.txt" }
        retFile = await file(infFile);
        retApi = { 'ret': true, 'res': { 'body': retFile.res } }


        if (!retApi.ret || !retApi.res.body.includes('Campanha')) {
            err = `$ [leads] FALSE: retApi 1`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            // REAUTENTICAR
            let infLogin, retLogin
            infLogin = {
                'e': e,
                'aut': aut,
                'login': loginOk,
                'password': password,
            }
            retLogin = await loginJsf(infLogin);
            if (!retLogin.ret) {
                err = `$ [leads] FALSE: retLogin`
                logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
                infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLogin }
                retLog = await log(infLog);
                return retApi
            } else {
                infApi = {
                    'e': e, 'method': 'GET', 'url': url,
                    'headers': { 'Cookie': aut, }
                };
                retApi = await api(infApi);
                if (!retApi.ret || !retApi.res.body.includes('Campanha')) {
                    err = `$ [leads] FALSE: retApi 2`
                    logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
                    infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                    retLog = await log(infLog);
                    return ret
                } else {
                    retApi = retApi.res.body
                }
            }
        } else {
            retApi = retApi.res.body
        }

        // ## LOG ## retApi
        err = `$ [leads] LOG retApi`
        infLog = { 'e': e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        retLog = await log(infLog);

        // PEGAR A TABELA
        infRegex = { 'e': e, 'pattern': `<table(.*?)</table>`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['3']) {
            ret['msg'] = `Não achou a tabela`;
            err = `$ [leads] ${ret.msg}`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            return ret
        }
        retRegex = `<table${retRegex.res['3']}</table>`

        // HTML → JSON
        let infHtmlToJson, retHtmlToJson
        infHtmlToJson = { 'e': e, 'mode': '2', 'html': retRegex }
        retHtmlToJson = await htmlToJsonNew(infHtmlToJson);
        if (!retHtmlToJson.ret || retHtmlToJson.res.length < 1) {
            err = `$ [leads] FALSE: retHtmlToJson`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
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
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
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
        for (let [index, value] of retHtmlToJson.reverse().entries()) {
            // PEGAR O LEAD
            if (sendLeads) {
                let data = new Date(value.col2);
                let day = data.getDate().toString().padStart(2, '0');
                let mon = (data.getMonth() + 1).toString().padStart(2, '0');
                let yea = data.getFullYear().toString();
                let hou = data.getHours().toString().padStart(2, '0');
                let min = data.getMinutes().toString().padStart(2, '0');
                let sec = data.getSeconds().toString().padStart(2, '0');
                data = `${day}/${mon}/${yea} ${hou}:${min}:${sec}`;
                leadsNew.push({
                    'leadId': `${yea}-${mon}-${day}_${hou}.${min}.${sec}-${value.col4}`,
                    'date': data,
                    'tel': value.col4 ? value.col4 : 'null',
                    'cnpj': value.col5 ? value.col5 : 'null',
                    'razaoSocial': 'RAZAO SOCIAL AQUI',
                    'email': 'emailAqui@gmail.com',
                    'administrador': value.col3 ? value.col3 : 'null',
                    'mailing': value.col6 ? value.col6 : 'null',
                })
            }
            // PERMITIR NOVOS LEADS (MANTER NO FINAL!!!)
            if (lastLead.includes(`${value.col5}${conSplInf}${value.col4}`)) {
                sendLeads = true
            }
        }

        ret['res'] = leadsNew
        ret['msg'] = `LEADS: OK`
        ret['ret'] = true

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
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
