// let infLogin, retLogin // 'logFun': true,
// infLogin = { 'aut': false }
// retLogin = await login(infLogin)
// console.log(retLogin)

async function login(inf) {
    let ret = { 'ret': false };
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `[login] ANTES de autenticar`, '\n');

        let infApi, retApi, infRegex, retRegex, infConfigStorage, retConfigStorage, infLog, retLog
        // PEGAR A LOGIN E AUT DO CONFIG
        infConfigStorage = { 'action': 'get', 'functionLocal': false, 'key': 'telein' } // 'functionLocal' SOMENTE NO NODEJS
        retConfigStorage = await configStorage(infConfigStorage);
        if (!retConfigStorage.ret) {
            console.log('[login] FALSE: retConfigStorage');
            return retConfigStorage
        } else {
            retConfigStorage = retConfigStorage.res
        }
        let login = inf && inf.login ? inf.login : retConfigStorage.login
        login = encodeURIComponent(login)
        let senha = inf && inf.senha ? inf.senha : retConfigStorage.senha
        senha = encodeURIComponent(senha)
        let aut = inf && inf.aut ? inf.aut : retConfigStorage.aut

        // [1] FAZER LOGIN
        infApi = {
            // 'logFun': true, 
            'method': 'POST', 'url': `https://interface.telein.com.br/op_access.php`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cookie': aut,
            },
            'body': `login=${login}&senha=${senha}`
        };
        retApi = await api(infApi);
        if (!retApi.ret || !retApi.res.body.includes('escolher.php')) {
            console.log('[login] FALSE: retApi 1');
            let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `login_1_api_FALSE.txt`, 'text': retApi }
            let retLog = await log(infLog);
            ret['msg'] = `Erro ao fazer login`;
            return ret
        } else {
            retApi = retApi.res.body
        }

        // [2] LISTAR USUÁRIOS
        infApi = {
            // 'logFun': true,
            'method': 'GET', 'url': `https://interface.telein.com.br/escolher.php`,
            'headers': {
                'Cookie': aut,
            }
        };
        retApi = await api(infApi);
        if (!retApi.ret || !retApi.res.body.includes('id_interface')) {
            console.log('[login] FALSE: retApi 2');
            let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `login_2_api_FALSE.txt`, 'text': retApi }
            let retLog = await log(infLog);
            ret['msg'] = `Erro ao pegar usuários`;
            return ret
        } else {
            retApi = retApi.res.body
        }

        // PEGAR A INTERFACE
        infRegex = { 'pattern': `name="interface" value="(.*?)">`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['1']) {
            console.log('[login] FALSE: retRegex 1');
            let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `login_NAO_ACHOU_A_INTERFACE.txt`, 'text': retApi }
            let retLog = await log(infLog);
            ret['msg'] = `Não achou a interface`;
            return ret
        }
        let uraInterface = retRegex.res['1']

        // PEGAR O ID DA INTERFACE
        infRegex = { 'pattern': `name="id_interface" value="(.*?)">`, 'text': retApi }
        // infRegex = { 'pattern': `name="subatual" value="(.*?)">`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['1']) {
            console.log('[login] FALSE: retRegex 2');
            let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `login_NAO_ACHOU_A_INTERFACE_ID.txt`, 'text': retApi }
            let retLog = await log(infLog);
            ret['msg'] = `Não achou a interface id`;
            return ret
        }
        let uraInterfaceId = retRegex.res['1']

        // PEGAR O SUBATUAL
        infRegex = { 'pattern': `name="subatual" value="(.*?)">`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['1']) {
            console.log('[login] FALSE: retRegex 3');
            let infLog = { 'folder': 'Registros', 'functionLocal': false, 'path': `login_NAO_ACHOU_O_SUBATUAL.txt`, 'text': retApi }
            let retLog = await log(infLog);
            ret['msg'] = `Não achou o subatual`;
            return ret
        }
        let uraSubatual = retRegex.res['1']

        ret['res'] = {
            'uraInterface': uraInterface,
            'uraInterfaceId': uraInterfaceId,
            'uraSubatual': uraSubatual
        };
        ret['msg'] = `LOGIN: OK`;
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
    window['login'] = login;
} else { // NODEJS
    global['login'] = login;
}

