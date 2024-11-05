// let infLogin, retLogin
// infLogin = { e, 'aut': false }
// retLogin = await login(infLogin); console.log(retLogin)

let e = import.meta.url, ee = e;
async function login(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ e, ee, 'write': true, 'msg': `ANTES DE AUTENTICAR` })

        let infApi, retApi, infLog, err
        let aut = inf && inf.aut ? inf.aut : 'aaaa';
        let loginOk = inf && inf.login ? inf.login : 'aaaa';
        let password = inf && inf.password ? inf.password : 'aaaa';
        let interfaceOk = inf && inf.interface ? inf.interface : 'aaaa';
        let id_interfaceOk = inf && inf.id_interface ? inf.id_interface : 'aaaa';
        let subatualOk = inf && inf.subatual ? inf.subatual : 'aaaa';

        // [1] LOGIN
        infApi = {
            e, 'method': 'POST', 'url': `https://interface.telein.com.br/op_access.php`,
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
            err = `% [login] FALSE: retApi 1`
            logConsole({ e, ee, 'write': true, 'msg': `${err}` })
            infLog = { e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            await log(infLog);
            ret['msg'] = `LOGIN: ERRO | AO FAZER LOGIN`;
            return ret
        } else {
            retApi = retApi.res.body
        }

        // ## LOG ## retApi
        err = `% [login] LOG retApi`
        infLog = { e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        await log(infLog);

        // [2] USUÁRIO [SELECIONAR]
        infApi = {
            e, 'method': 'POST', 'url': `https://interface.telein.com.br/alterarinterface.php`,
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
            err = `% [login] FALSE: retApi 2`
            logConsole({ e, ee, 'write': true, 'msg': `${err}` })
            infLog = { e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            await log(infLog);
            ret['msg'] = `LOGIN: ERRO | AO PEGAR E SELECIONAR O USUÁRIO`;
            return ret
        }
        ret['msg'] = `LOGIN: OK`;
        ret['ret'] = true

        logConsole({ e, ee, 'write': true, 'msg': `ESPERANDO 15 SEGUNDOS APÓS O LOGIN` })
        await new Promise(resolve => { setTimeout(resolve, 15000) })

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['login'] = login;