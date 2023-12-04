// let infLeadGet, retLeadGet // 'logFun': true,
// infLeadGet = { 'e': e, 'aut': false, 'leadId': value.leadId }
// retLeadGet = await leadGet(infLeadGet);
// console.log(retLeadGet)

let e = import.meta.url;
async function leadGet(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (err, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': err, 'inf': inf, 'catchGlobal': true }) } }
        if (typeof window !== 'undefined') { window.addEventListener('error', (err) => errs(err, ret)); window.addEventListener('unhandledrejection', (err) => errs(err, ret)) }
        else { process.on('uncaughtException', (err) => errs(err, ret)); process.on('unhandledRejection', (err) => errs(err, ret)) }
    }
    try {
        let infApi, retApi, infRegex, retRegex, infLog, retLog, time, err
        let aut = inf && inf.aut ? inf.aut : 'aaaa';
        let loginOk = inf && inf.login ? inf.login : 'aaaa';
        let password = inf && inf.password ? inf.password : 'aaaa';
        let interfaceOk = inf && inf.interface ? inf.interface : 'aaaa';
        let id_interfaceOk = inf && inf.id_interface ? inf.id_interface : 'aaaa';
        let subatualOk = inf && inf.subatual ? inf.subatual : 'aaaa';
        let leadId = inf && inf.leadId ? inf.leadId : `25799086`

        // API [PEGAR INF DO LEAD]
        infApi = {

            'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=247&id_contato=${leadId}`,
            'headers': { 'Cookie': aut, }
        };
        retApi = await api(infApi);
        if (!retApi.ret || !retApi.res.body.includes('Tecla Digitada')) {
            err = `[leadGet] FALSE: retApi 1`
            console.log(err);
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            // REAUTENTICAR
            let infLogin, retLogin
            infLogin = { 'e': e, 'aut': aut }
            retLogin = await login(infLogin);
            if (!retLogin.ret) {
                err = `[leadGet] FALSE: retLogin`
                console.log(err);
                infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLogin }
                retLog = await log(infLog);
                return retApi
            } else {
                infApi = {
                    'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=247&id_contato=${leadId}`,
                    'headers': { 'Cookie': aut, }
                };
                retApi = await api(infApi);
                if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
                    if (retApi.res && retApi.res.body.includes('para acessar as funcionalidades')) {
                        err = `[leadGet] sem permissão para acessar as funcionalidades`
                        console.log(err);
                        infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        retLog = await log(infLog);
                        return ret
                    } else {
                        err = `[leadGet] FALSE: retAp 2`
                        console.log(err);
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

        // // TESTES [LER ARQUIVO]
        // let infFile, retFile
        // infFile = {'e': e, 'action': 'read', 'functionLocal': false, 'path': './log/LEAD_GET.txt' }
        // retFile = await file(infFile); retApi = retFile.res

        // time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `[leadGet] DEPOIS de pegar o lead`, '\n');
        // infLog = { 'e': e,'folder': 'Registros', 'path': `leadGet.txt`, 'text': retApi }
        // retLog = await log(infLog);

        // ## LOG ## retApi
        err = `[leadGet] LOG retApi ${leadId}`
        infLog = { 'e': e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        retLog = await log(infLog);

        // PEGAR [TELEFONE]
        infRegex = { 'pattern': `Contato:(.*?)</h2>`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['1']) {
            ret['msg'] = `Não achou o telefone do lead`;
            err = `[leadGet] ${ret.msg}`
            // console.log(err);
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
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
            err = `[leadGet] FALSE: retHtmlToJson`
            console.log(err);
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            retLog = await log(infLog);
            return retApi
        } else { retHtmlToJson = JSON.parse(retHtmlToJson.res.replaceAll('�', '').replaceAll('Ouvir Gravao', 'key').replaceAll('Baixar', 'value')) }

        if (!(retHtmlToJson instanceof Array)) {
            ret['msg'] = `Não achou a tabela do HTML`;
            err = `[leadGet] ${ret.msg}`
            console.log(err);
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            retLog = await log(infLog);
            return ret
        }

        if (!retHtmlToJson.length > 0) {
            err = `[leadGet] retHtmlToJson ARRAY VAZIA`
            console.log(err);
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

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
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
    window['leadGet'] = leadGet;
} else { // NODEJS
    global['leadGet'] = leadGet;
}
