// let infLogin, retLogin // 'logFun': true,
// infLogin = { 'aut': false }
// retLogin = await login(infLogin)
// console.log(retLogin)

async function login(inf) {
    let ret = { 'ret': false };
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `[login] ANTES de autenticar`, '\n');

        let infApi, retApi, infRegex, retRegex, infLog, retLog, err
        let aut = inf && inf.aut ? inf.aut : 'aaaa';
        let loginOk = inf && inf.login ? inf.login : 'aaaa';
        let password = inf && inf.password ? inf.password : 'aaaa';
        let interfaceOk = inf && inf.interface ? inf.interface : 'aaaa';
        let id_interfaceOk = inf && inf.id_interface ? inf.id_interface : 'aaaa';
        let subatualOk = inf && inf.subatual ? inf.subatual : 'aaaa';

        // [1] LOGIN
        infApi = {
            'method': 'POST', 'url': `https://interface.telein.com.br/op_access.php`,
            'headers': {
                'Cookie': aut,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            'body': {
                'login': loginOk,
                'senha': password,
            }
        };
        retApi = await api(infApi);
        if (!retApi.ret || !retApi.res.body.includes('escolher.php')) {
            err = `[login] FALSE: retApi 1`
            console.log(err);
            infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            ret['msg'] = `Erro ao fazer login`;
            return ret
        } else {
            retApi = retApi.res.body
        }

        // ## LOG ## retApi
        err = `[login] LOG retApi`
        infLog = { 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        retLog = await log(infLog);

        // [2] USUÁRIO [SELECIONAR]
        infApi = {
            'method': 'POST', 'url': `https://interface.telein.com.br/alterarinterface.php`,
            'headers': {
                'Cookie': aut,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            'body': {
                'interface': interfaceOk,
                'id_interface': id_interfaceOk,
                'subatual': subatualOk,
            }
        };
        retApi = await api(infApi);
        if (!retApi.ret || retApi.res.code !== 200) {
            err = `[login] FALSE: retApi 2`
            console.log(err);
            infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            ret['msg'] = `Erro ao pegar selecionar usuário`;
            return ret
        }
        ret['msg'] = `LOGIN: OK`;
        ret['ret'] = true

        await new Promise(resolve => { setTimeout(resolve, 2500) })

        // ### LOG FUN ###
        if (inf.logFun) {
            let infFile = { 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['login'] = login;
} else { // NODEJS
    global['login'] = login;
}



