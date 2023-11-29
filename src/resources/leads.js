// let infLeads, retLeads // 'logFun': true,
// infLeads = {
//     'aut': false,
//     'status': [ // 'Retorno realizado' | 'Pendente de retorno' 'Visualizado para retorno'
//         // 'Retorno realizado', // ###### TESTES ######
//         'Pendente de retorno',
//         'Visualizado para retorno',
//     ]
// }
// retLeads = await leads(infLeads);
// console.log(retLeads)

async function leads(inf) {
    let ret = { 'ret': false };
    try {
        let infApi, retApi, infRegex, retRegex, infConfigStorage, retConfigStorage, infLog, retLog, time
        let aut = inf && inf.aut ? inf.aut : retConfigStorage.aut
        let status = inf && inf.status ? inf.status : ['Retorno realizado']

        // API [LISTA DE LEADS]
        infApi = {
            // 'logFun': true,
            'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=246`,
            'headers': { 'Cookie': aut, }
        };
        retApi = await api(infApi);
        if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
            console.log('[leads] FALSE: retApi 1');
            // REAUTENTICAR
            let infLogin, retLogin
            infLogin = { 'aut': aut }
            retLogin = await login(infLogin);
            if (!retLogin.ret) {
                console.log('[leads] FALSE: retLogin');
                let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `leads_NAO_CONSEGUIU_LOGAR.txt`, 'text': retApi }
                let retLog = await log(infLog);
                return retApi
            } else {
                infApi = {
                    // 'logFun': true, 
                    'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=246`,
                    'headers': { 'Cookie': aut, }
                };
                retApi = await api(infApi);
                if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
                    if (retApi.res.body.includes('para acessar as funcionalidades')) {
                        console.log('[leads] FALSE: sem permissão para acessar as funcionalidades');
                    } else {
                        console.log('[leads] FALSE: retApi 3');
                        let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `leads_NAO_ACHOU_A_LISTA_DE_LEADS_2.txt`, 'text': retApi }
                        let retLog = await log(infLog);
                        return retApi
                    }
                }
            }
        } else { retApi = retApi.res.body }

        // time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `[leads] DEPOIS da lista de lead`, '\n');
        // infLog = { 'folder': 'Registros', 'path': `leads.txt`, 'text': retApi }
        // retLog = await log(infLog);

        // // TESTES [LER ARQUIVO]
        // let infFile, retFile
        // infFile = { 'action': 'read', 'functionLocal': false, 'path': './log/LEADS.txt' }
        // retFile = await file(infFile); retApi = retFile.res

        // PEGAR [ID LEAD]
        infRegex = { 'pattern': `href="index.php?link=247&id_contato=(.*?)"`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['5']) {
            console.log('[leads] FALSE: retRegex');
            let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `leads_NAO_ACHOU_O_ID_DO_LEAD.txt`, 'text': retApi }
            let retLog = await log(infLog);
            ret['msg'] = `Não achou o id do lead`;
            return ret
        }
        let leadId = retRegex.res['5']

        // HTML → JSON
        let infHtmlToJson, retHtmlToJson
        infHtmlToJson = { 'randomCol': true, 'html': retApi }
        retHtmlToJson = await htmlToJson(infHtmlToJson);
        if (!retHtmlToJson.ret) {
            console.log('[leads] FALSE: retHtmlToJson');
            return retHtmlToJson
        } else {
            retHtmlToJson = JSON.parse(retHtmlToJson.res)
        }

        // infLog = { 'folder': 'Registros', 'path': `HTML_JSON.txt`, 'text': retHtmlToJson }
        // retLog = await log(infLog);

        // ARRAY COM A LISTA DE LEADS
        let leadsNew = []
        for (let [index, value] of retHtmlToJson.entries()) {
            // ###########################
            if (status.includes(value.colInd4)) {
                let data = new Date(value.colInd0);
                let day = data.getDate().toString().padStart(2, '0');
                let mon = (data.getMonth() + 1).toString().padStart(2, '0');
                let yea = data.getFullYear().toString();
                let hou = data.getHours().toString().padStart(2, '0');
                let min = data.getMinutes().toString().padStart(2, '0');
                let sec = data.getSeconds().toString().padStart(2, '0');
                data = `${day}/${mon}/${yea} ${hou}:${min}:${sec}`;
                leadsNew.push({
                    'leadId': leadId[index],
                    'date': data,
                    'status': value.colInd4,
                    'telAbrev': value.colInd1,
                    'mailing': value.colInd7,
                })
            }
        }
        ret['res'] = leadsNew
        ret['msg'] = `LEADS: OK`
        ret['ret'] = true

        // ### LOG FUN ###
        if (inf.logFun) {
            let infFile = { 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['leads'] = leads;
} else { // NODEJS
    global['leads'] = leads;
}
