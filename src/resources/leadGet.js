async function leadGet(inf) {
    await import('./@export');
    let ret = { 'ret': false };
    try {
        let infApi, retApi, infRegex, retRegex, infConfigStorage, retConfigStorage
        // PEGAR O AUT DO CONFIG
        infConfigStorage = { 'action': 'get', 'functionLocal': false, 'key': 'telein' } // 'functionLocal' SOMENTE NO NODEJS
        retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) {
            console.log('[leadGet] FALSE: retConfigStorage');
            return retConfigStorage
        } else {
            retConfigStorage = retConfigStorage.res
        }
        let aut = inf && inf.aut ? inf.aut : retConfigStorage.aut
        let leadId = inf && inf.leadId ? inf.leadId : `25799086`

        // API [PEGAR INF DO LEAD]
        infApi = {
            'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=247&id_contato=${leadId}`,
            'headers': { 'Cookie': aut, }
        };
        // retApi = await api(infApi);
        // if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
        //     console.log('[leadGet] FALSE: retApi');
        //     if (!retApi.res.body.includes('E-mail ou login')) {
        //         console.log('[leadGet] FALSE: retApi');
        //         let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leadGet_NAO_ACHOU_A_INF_DO_LEAD_1.txt`, 'text': retApi }
        //         let retLog = await log(infLog);
        //         return retApi
        //     } else {
        //         // REAUTENTICAR
        //         let infLogin, retLogin
        //         infLogin = { 'aut': false }
        //         retLogin = await login(infLogin);
        //         if (!retLogin.ret) {
        //             console.log('[leadGet] FALSE: retLogin');
        //             let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leadGet_NAO_CONSEGUIU_LOGAR.txt`, 'text': retApi }
        //             let retLog = await log(infLog);
        //             return retApi
        //         } else {
        //             infApi = {
        //                 'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=247&id_contato=${leadId}`,
        //                 'headers': { 'Cookie': aut, }
        //             };
        //             retApi = await api(infApi);
        //             if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
        //                 console.log('[leadGet] FALSE: retApi');
        //                 let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leadGet_NAO_ACHOU_A_INF_DO_LEAD_2.txt`, 'text': retApi }
        //                 let retLog = await log(infLog);
        //                 return retApi
        //             }
        //         }
        //     }
        // } else { retApi = retApi.res.body }

        // TESTES [LER ARQUIVO]
        let infFile, retFile
        infFile = { 'action': 'read', 'functionLocal': false, 'path': './log/LEAD_GET.txt' }
        retFile = await file(infFile); retApi = retFile.res

        // PEGAR [TELEFONE]
        infRegex = { 'pattern': `Contato:(.*?)</h2>`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['1']) {
            console.log('[leadGet] FALSE: retRegex');
            let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leads_NAO_ACHOU_O_ID_DO_LEAD.txt`, 'text': retApi }
            let retLog = await log(infLog);
            ret['msg'] = `Não achou o id do lead`;
            return {
                ...({ ret: ret.ret }),
                ...(ret.msg && { msg: ret.msg }),
                ...(ret.res && { res: ret.res }),
            };
        }
        let tel = retRegex.res['1'].replace(/[^0-9]/g, '');

        // PEGAR [ID LEAD]
        infRegex = { 'pattern': `link=247&tipo=sucesso&id_contato=(.*?)' method='post'`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['1']) {
            console.log('[leadGet] FALSE: retRegex');
            let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leads_NAO_ACHOU_O_ID_DO_LEAD.txt`, 'text': retApi }
            let retLog = await log(infLog);
            ret['msg'] = `Não achou o id do lead`;
            return {
                ...({ ret: ret.ret }),
                ...(ret.msg && { msg: ret.msg }),
                ...(ret.res && { res: ret.res }),
            };
        }

        ret['res'] = {
            'tel': tel,
            'leadId': retRegex.res['1'],
        }
        ret['msg'] = `LEAD GET: OK`
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
    window['leadGet'] = leadGet;
} else { // NODEJS
    global['leadGet'] = leadGet;
}
