async function leadGet(inf) {
    await import('../../../Chrome_Extension/src/resources/@functions.js')
    let ret = { 'ret': false };
    try {
        let infApi, retApi, infRegex, retRegex
        // PEGAR O AUT DO CONFIG
        infConfigStorage = { 'action': 'get', 'functionLocal': false, 'key': 'telein' } // 'functionLocal' SOMENTE NO NODEJS
        retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res }
        let aut = inf && inf.aut ? inf.aut : retConfigStorage.aut
        let leadId = inf && inf.leadId ? inf.leadId : `25787539`

        // API [PEGAR INF DO LEAD]
        infApi = {
            'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=246`,
            'headers': { 'Cookie': aut, }
        };
        retApi = await api(infApi); if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
            if (!retApi.res.body.includes('E-mail ou login')) {
                console.log('leadGet: ERRO AO PEGAR INF DO LEAD 1')
                let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leadGet_NAO_ACHOU_A_INF_DO_LEAD_1.txt`, 'text': retApi }
                let retLog = await log(infLog);
                return retApi
            } else {
                // REAUTENTICAR
                let infLogin, retLogin
                infLogin = { 'aut': false }
                retLogin = await login(infLogin);
                if (!retLogin.ret) {
                    console.log('leadGet: ERRO AO FAZER LOGIN')
                    let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leadGet_NAO_CONSEGUIU_LOGAR.txt`, 'text': retApi }
                    let retLog = await log(infLog);
                    return retApi
                } else {
                    infApi = {
                        'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=246`,
                        'headers': { 'Cookie': aut, }
                    };
                    retApi = await api(infApi); if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
                        console.log('leadGet: ERRO AO PEGAR INF DO LEAD 2')
                        let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leadGet_NAO_ACHOU_A_INF_DO_LEAD_2.txt`, 'text': retApi }
                        let retLog = await log(infLog);
                        return retApi
                    }
                }
            }
        } else { retApi = retApi.res.body }

        ret['res'] = {
            'inf1': 'aaa',
            'inf2': 'aaa',
            'inf3': 'aaa',
        }
        ret['msg'] = `LEAD GET: OK`
        ret['ret'] = true
    } catch (e) {
        let m = await regexE({ 'e': e });
        ret['msg'] = m.res
    };
    return {
        ...(ret.ret && { ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (typeof eng === 'boolean') {
    if (eng) { // CHROME
        window['leadGet'] = leadGet;
    } else { // NODEJS
        global['leadGet'] = leadGet;
    }
}