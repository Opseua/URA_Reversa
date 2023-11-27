
async function leads(inf) {
    await import('./@export');
    let ret = { 'ret': false };
    try {
        let infApi, retApi, infRegex, retRegex, infConfigStorage, retConfigStorage
        // PEGAR O AUT DO CONFIG
        infConfigStorage = { 'action': 'get', 'functionLocal': false, 'key': 'telein' } // 'functionLocal' SOMENTE NO NODEJS
        retConfigStorage = await configStorage(infConfigStorage);
        if (!retConfigStorage.ret) {
            console.log('[leads] FALSE: retConfigStorage');
            return retConfigStorage
        } else {
            retConfigStorage = retConfigStorage.res
        }
        let aut = inf && inf.aut ? inf.aut : retConfigStorage.aut

        // API [LISTA DE LEADS]
        infApi = {
            'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=246`,
            'headers': { 'Cookie': aut, }
        };
        // retApi = await api(infApi);
        // if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
        //     console.log('[leads] FALSE: retApi');
        //     if (!retApi.res.body.includes('E-mail ou login')) {
        //         console.log('[leads] FALSE: retApi');
        //         let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leads_NAO_ACHOU_A_LISTA_DE_LEADS_1.txt`, 'text': retApi }
        //         let retLog = await log(infLog);
        //         return retApi
        //     } else {
        //         // REAUTENTICAR
        //         let infLogin, retLogin
        //         infLogin = { 'aut': false }
        //         retLogin = await login(infLogin);
        //         if (!retLogin.ret) {
        //             console.log('[leads] FALSE: retLogin');
        //             let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leads_NAO_CONSEGUIU_LOGAR.txt`, 'text': retApi }
        //             let retLog = await log(infLog);
        //             return retApi
        //         } else {
        //             infApi = {
        //                 'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=246`,
        //                 'headers': { 'Cookie': aut, }
        //             };
        //             retApi = await api(infApi);
        //             if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
        //                 console.log('[leads] FALSE: retApi');
        //                 let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leads_NAO_ACHOU_A_LISTA_DE_LEADS_2.txt`, 'text': retApi }
        //                 let retLog = await log(infLog);
        //                 return retApi
        //             }
        //         }
        //     }
        // } else { retApi = retApi.res.body }

        // TESTES [LER ARQUIVO]
        let infFile, retFile
        infFile = { 'action': 'read', 'functionLocal': false, 'path': './log/LEADS.txt' }
        retFile = await file(infFile); retApi = retFile.res

        // PEGAR [ID LEAD]
        infRegex = { 'pattern': `href="index.php?link=247&id_contato=(.*?)"`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['5']) {
            console.log('[leads] FALSE: retRegex');
            let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leads_NAO_ACHOU_O_ID_DO_LEAD.txt`, 'text': retApi }
            let retLog = await log(infLog);
            ret['msg'] = `Não achou o id do lead`;
            return {
                ...({ ret: ret.ret }),
                ...(ret.msg && { msg: ret.msg }),
                ...(ret.res && { res: ret.res }),
            };
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

        // ARRAY COM A LISTA DE LEADS
        let leadsNew = []
        for (let [index, value] of retHtmlToJson.entries()) {
            if (value.colInd4 == 'Pendente de retorno') {
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
                })
            }
        }
        ret['res'] = leadsNew
        ret['msg'] = `LEADS: OK`
        ret['ret'] = true
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
