// let infLeadChangeStatus, retLeadChangeStatus // 'logFun': true,
// infLeadChangeStatus = { 'e': e, 'aut': false, 'leadId': value.leadId, 'status': '1' } // '4' → Inapto | '1' → Venda Realizada
// retLeadChangeStatus = await leadChangeStatus(infLeadChangeStatus);
// console.log(retLeadChangeStatus)

let e = import.meta.url;
async function leadChangeStatus(inf) {
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
        let statusOption = {
            '1': 'Venda Realizada', '2': 'Sem interesse ', '3': 'Não era o cliente', '4': 'Inapto',
            '5': 'Não atende', '6': 'Caixa postal ', '7': 'Cliente vai analisar a proposta', '8': 'Solicitou contato depois',
            '9': 'Tratando no Whatsapp', '10': 'Aguardando Documento', '11': 'Cliente da Base ', '12': 'Fora de cobertura',
        }
        let statusOk = inf && inf.status ? inf.status : '4'

        // API [ALTERAR STATUS DO LEAD]
        infApi = {
            'method': 'POST', 'url': `https://interface.telein.com.br/index.php?link=247&tipo=sucesso&id_contato=${leadId}`,
            'headers': {
                'Cookie': aut,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            'body': {
                'tabulacao': statusOk,
            }
        };
        retApi = await api(infApi);

        // ## LOG ## retApi
        err = `[leadChangeStatus] LOG retApi ${leadId}`
        infLog = { 'e': e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        retLog = await log(infLog);

        if (!retApi.ret || !retApi.res.body.includes('Retorno realizado por')) {
            err = `[leadChangeStatus] FALSE: retApi 1`
            console.log(err);
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            // REAUTENTICAR
            let infLogin, retLogin
            infLogin = { 'e': e, 'aut': aut }
            retLogin = await login(infLogin);
            if (!retLogin.ret) {
                err = `[leadChangeStatus] FALSE: retLogin 1`
                console.log(err);
                infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLogin }
                retLog = await log(infLog);
                return retApi
            } else {
                infApi = {
                    'method': 'POST', 'url': `https://interface.telein.com.br/index.php?link=247&tipo=sucesso&id_contato=${leadId}`,
                    'headers': {
                        'Cookie': aut,
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    },
                    'body': {
                        'tabulacao': statusOk,
                    }
                };
                retApi = await api(infApi);
                if (!retApi.ret || !retApi.res.body.includes('Retorno realizado por')) {
                    if (retApi.res && retApi.res.body.includes('para acessar as funcionalidades')) {
                        err = `[leadChangeStatus] sem permissão para acessar as funcionalidades`
                        console.log(err);
                        infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        retLog = await log(infLog);
                        return ret
                    } else {
                        err = `[leadChangeStatus] FALSE: retLogin 2`
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

        // TESTES [LER ARQUIVO]
        // let infFile, retFile
        // infFile = { 'e': e,'action': 'read', 'functionLocal': false, 'path': './log/LEAD_CHANGE_STATUS_OK.txt' }
        // retFile = await file(infFile); retApi = retFile.res

        // time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `[leadChangeStatus] DEPOIS de alterar o status`, '\n');
        // infLog = {'e': e, 'folder': 'Registros', 'path': `leadChangeStatus.txt`, 'text': retApi }
        // retLog = await log(infLog);

        ret['res'] = {
            'leadId': leadId,
            'status': statusOption[statusOk]
        }
        ret['msg'] = `LEAD CHANGE STATUS: OK`
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
    window['leadChangeStatus'] = leadChangeStatus;
} else { // NODEJS
    global['leadChangeStatus'] = leadChangeStatus;
}
