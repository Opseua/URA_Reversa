// let infLeadGet, retLeadGet // 'logFun': true,
// infLeadGet = { 'e': e, 'aut': false, 'leadId': value.leadId }
// retLeadGet = await leadGet(infLeadGet);
// console.log(retLeadGet)

let e = import.meta.url, ee = e;
async function leadGet(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let infApi, retApi, infRegex, retRegex, infLog, retLog, err
        let aut = inf && inf.aut ? inf.aut : 'aaaa';
        let leadId = inf && inf.leadId ? inf.leadId : `25799086`

        // API [PEGAR INF DO LEAD]
        infApi = {
            'e': e, 'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=247&id_contato=${leadId}`,
            'headers': { 'Cookie': aut, }
        };
        retApi = await api(infApi);
        if (!retApi.ret || !retApi.res.body.includes('Tecla Digitada')) {
            err = `$ [leadGet] FALSE: retApi 1`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            // REAUTENTICAR
            let infLogin, retLogin
            infLogin = { 'e': e, 'aut': aut }
            retLogin = await login(infLogin);
            if (!retLogin.ret) {
                err = `$ [leadGet] FALSE: retLogin`
                logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
                infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLogin }
                retLog = await log(infLog);
                return retApi
            } else {
                infApi = {
                    'e': e, 'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=247&id_contato=${leadId}`,
                    'headers': { 'Cookie': aut, }
                };
                retApi = await api(infApi);
                if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
                    if (retApi.res && retApi.res.body.includes('para acessar as funcionalidades')) {
                        err = `$ [leadGet] sem permissão para acessar as funcionalidades`
                        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
                        infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        retLog = await log(infLog);
                        return ret
                    } else {
                        err = `$ [leadGet] FALSE: retAp 2`
                        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
                        infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        retLog = await log(infLog);
                        return ret
                    }
                } else {
                    retApi = retApi.res.body
                }
            }
        } else {
            retApi = retApi.res.body
        }

        // ## LOG ## retApi
        err = `$ [leadGet] LOG retApi ${leadId}`
        infLog = { 'e': e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        retLog = await log(infLog);

        // PEGAR [TELEFONE]
        infRegex = { 'e': e, 'pattern': `Contato:(.*?)</h2>`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['1']) {
            ret['msg'] = `Não achou o telefone do lead`;
            err = `$ [leadGet] ${ret.msg}`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            return ret
        }
        let tel = retRegex.res['1'].replace(/[^0-9]/g, '');

        // HTML → JSON [TABELA]
        let infHtmlToJson, retHtmlToJson
        infHtmlToJson = {
            'e': e, 'randomCol': false,
            'html': retApi
        }
        retHtmlToJson = await htmlToJson(infHtmlToJson)
        if (!retHtmlToJson.ret) {
            err = `$ [leadGet] FALSE: retHtmlToJson`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            retLog = await log(infLog);
            return retApi
        } else { retHtmlToJson = JSON.parse(retHtmlToJson.res.replace(/�/g, '').replace(/Ouvir Gravao/g, 'key').replace(/Baixar/g, 'value')) }

        if (!(retHtmlToJson instanceof Array)) {
            ret['msg'] = `Não achou a tabela do HTML`;
            err = `$ [leadGet] ${ret.msg}`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            retLog = await log(infLog);
            return ret
        }

        if (!retHtmlToJson.length > 0) {
            err = `$ [leadGet] retHtmlToJson ARRAY VAZIA`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            retLog = await log(infLog);
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
                        break
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
                        break
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
                        break
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
                    if (value.value.length > 1 && !value.value.includes('MAIL')) {
                        administrador = value.value;
                        break
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
    window['leadGet'] = leadGet;
} else { // NODEJS
    global['leadGet'] = leadGet;
}
