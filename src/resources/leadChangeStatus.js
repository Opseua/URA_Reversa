// let infLeadChangeStatus, retLeadChangeStatus // 'logFun': true,
// infLeadChangeStatus = { 'e': e, 'aut': false, 'leadId': value.leadId, 'status': '1' } // '4' → Inapto | '1' → Venda Realizada
// retLeadChangeStatus = await leadChangeStatus(infLeadChangeStatus);
// console.log(retLeadChangeStatus)

let e = import.meta.url, ee = e;
async function leadChangeStatus(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let infApi, retApi, infRegex, retRegex, infLog, retLog, time, err
        let aut = inf && inf.aut ? inf.aut : 'aaaa';
        let leadId = inf && inf.leadId ? inf.leadId : `25799086`
        let statusOption = {
            '1': 'Venda Realizada', '2': 'Sem interesse ', '3': 'Não era o cliente', '4': 'Inapto',
            '5': 'Não atende', '6': 'Caixa postal ', '7': 'Cliente vai analisar a proposta', '8': 'Solicitou contato depois',
            '9': 'Tratando no Whatsapp', '10': 'Aguardando Documento', '11': 'Cliente da Base ', '12': 'Fora de cobertura',
        }
        let statusOk = inf && inf.status ? inf.status : '4'

        // API [ALTERAR STATUS DO LEAD]
        infApi = {
            'e': e, 'method': 'POST', 'url': `https://interface.telein.com.br/index.php?link=247&tipo=sucesso&id_contato=${leadId}`,
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
        err = `$ [leadChangeStatus] LOG retApi ${leadId}`
        infLog = { 'e': e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        retLog = await log(infLog);

        if (!retApi.ret || !retApi.res.body.includes('Retorno realizado por')) {
            err = `$ [leadChangeStatus] FALSE: retApi 1`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            // REAUTENTICAR
            let infLogin, retLogin
            infLogin = { 'e': e, 'aut': aut }
            retLogin = await login(infLogin);
            if (!retLogin.ret) {
                err = `$ [leadChangeStatus] FALSE: retLogin 1`
                logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
                infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLogin }
                retLog = await log(infLog);
                return retApi
            } else {
                infApi = {
                    'e': e, 'method': 'POST', 'url': `https://interface.telein.com.br/index.php?link=247&tipo=sucesso&id_contato=${leadId}`,
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
                        err = `$ [leadChangeStatus] sem permissão para acessar as funcionalidades`
                        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
                        infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        retLog = await log(infLog);
                        return ret
                    } else {
                        err = `$ [leadChangeStatus] FALSE: retLogin 2`
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

        ret['res'] = {
            'leadId': leadId,
            'status': statusOption[statusOk]
        }
        ret['msg'] = `LEAD CHANGE STATUS: OK`
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
    window['leadChangeStatus'] = leadChangeStatus;
} else { // NODEJS
    global['leadChangeStatus'] = leadChangeStatus;
}
