// let infLeadGet, retLeadGet // 'logFun': true,
// infLeadGet = { 'aut': false, 'leadId': value.leadId }
// retLeadGet = await leadGet(infLeadGet);
// console.log(retLeadGet)

async function leadGet(inf) {
    let ret = { 'ret': false };
    try {
        let infApi, retApi, infRegex, retRegex, infConfigStorage, retConfigStorage, infLog, retLog, time
        let aut = inf && inf.aut ? inf.aut : retConfigStorage.aut
        let leadId = inf && inf.leadId ? inf.leadId : `25799086`

        // API [PEGAR INF DO LEAD]
        infApi = {
            // 'logFun': true,
            'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=247&id_contato=${leadId}`,
            'headers': { 'Cookie': aut, }
        };
        retApi = await api(infApi);
        if (!retApi.ret || !retApi.res.body.includes('Tecla Digitada')) {
            console.log('[leadGet] FALSE: retApi 1');
            // REAUTENTICAR
            let infLogin, retLogin
            infLogin = { 'aut': aut }
            retLogin = await login(infLogin);
            if (!retLogin.ret) {
                console.log('[leadGet] FALSE: retLogin');
                let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `leadGet_NAO_CONSEGUIU_LOGAR.txt`, 'text': retApi }
                let retLog = await log(infLog);
                return retApi
            } else {
                infApi = {
                    // 'logFun': true,
                    'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=247&id_contato=${leadId}`,
                    'headers': { 'Cookie': aut, }
                };
                retApi = await api(infApi);
                if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
                    if (retApi.res.body.includes('para acessar as funcionalidades')) {
                        console.log('[leads] FALSE: sem permissão para acessar as funcionalidades');
                    } else {
                        console.log('[leadGet] FALSE: retApi 3');
                        let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `leadGet_NAO_ACHOU_A_INF_DO_LEAD_2.txt`, 'text': retApi }
                        let retLog = await log(infLog);
                        return retApi
                    }
                }
            }
        } else { retApi = retApi.res.body }

        // // TESTES [LER ARQUIVO]
        // let infFile, retFile
        // infFile = { 'action': 'read', 'functionLocal': false, 'path': './log/LEAD_GET.txt' }
        // retFile = await file(infFile); retApi = retFile.res

        // time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `[leadGet] DEPOIS de pegar o lead`, '\n');
        // infLog = { 'folder': 'Registros', 'path': `leadGet.txt`, 'text': retApi }
        // retLog = await log(infLog);

        // PEGAR [TELEFONE]
        infRegex = { 'pattern': `Contato:(.*?)</h2>`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['1']) {
            console.log('[leadGet] FALSE: retRegex 1');
            let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `leads_NAO_ACHOU_O_TELEFONE_DO_LEAD.txt`, 'text': retApi }
            let retLog = await log(infLog);
            ret['msg'] = `Não achou o telefone do lead`;
            return ret
        }
        let tel = retRegex.res['1'].replace(/[^0-9]/g, '');

        // HTML → JSON [TABELA]
        let infHtmlToJson, retHtmlToJson
        infHtmlToJson = {
            'randomCol': false,
            'html': retApi
        }
        retHtmlToJson = await htmlToJson(infHtmlToJson)
        if (!retHtmlToJson.ret) {
            console.log('[leadGet] FALSE: htmlToJson');
            let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `leadGet_FALSE_HTML_TO_JSON.txt`, 'text': retApi }
            let retLog = await log(infLog);
            return retApi
        } else { retHtmlToJson = JSON.parse(retHtmlToJson.res.replaceAll('�', '').replaceAll('Ouvir Gravao', 'key').replaceAll('Baixar', 'value')) }

        if (!(retHtmlToJson instanceof Array)) {
            console.log('[leadGet] FALSE: não achou a tabela do HTML');
            let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `leads_NAO_ACHOU_A_TABELA_DO_HTML.txt`, 'text': retHtmlToJson }
            let retLog = await log(infLog);
            ret['msg'] = `Não achou a tabela do HTML`;
            return ret
        }

        // PEGAR [CNPJ]
        let cnpj = 'null'
        for (let [index, value] of retHtmlToJson.entries()) {
            if (typeof value.key === 'string') {
                let search = ['cnpj',];
                if (new RegExp(search.join('|'), 'i').test(value.key.toLowerCase())) {
                    if (value.value.length > 1) {
                        cnpj = value.value;
                    }
                }
            }
        }

        // PEGAR [RAZAO_SOCIAL]
        let razaoSocial = 'null'
        for (let [index, value] of retHtmlToJson.entries()) {
            if (typeof value.key === 'string') {
                let search = ['razao', 'razão', 'social',];
                if (new RegExp(search.join('|'), 'i').test(value.key.toLowerCase())) {
                    if (value.value.length > 1) {
                        razaoSocial = value.value;
                    }
                }
            }
        }

        // PEGAR [EMAIL]
        let email = 'null'
        for (let [index, value] of retHtmlToJson.entries()) {
            if (typeof value.key === 'string') {
                let search = ['email', 'e_mail', 'e-mail', 'mail', 'e mail'];
                if (new RegExp(search.join('|'), 'i').test(value.key.toLowerCase())) {
                    if (value.value.length > 1) {
                        email = value.value;
                    }
                }
            }
        }

        // PEGAR [ADMINISTRADOR]
        let administrador = 'null'
        for (let [index, value] of retHtmlToJson.entries()) {
            if (typeof value.key === 'string') {
                let search = ['administrador', 'sócio', 'socio', 'responsável', 'responsavel', 'nome'];
                if (new RegExp(search.join('|'), 'i').test(value.key.toLowerCase())) {
                    if (value.value.length > 1) {
                        administrador = value.value;
                    }
                }
            }
        }

        ret['res'] = {
            'tel': tel,
            'cnpj': cnpj,
            'razaoSocial': razaoSocial,
            'email': email,
            'administrador': administrador,
        }
        ret['msg'] = `LEAD GET: OK`
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
    window['leadGet'] = leadGet;
} else { // NODEJS
    global['leadGet'] = leadGet;
}
