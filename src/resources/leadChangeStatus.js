// let infLeadChangeStatus, retLeadChangeStatus // 'logFun': true,
// infLeadChangeStatus = { 'aut': false, 'leadId': value.leadId, 'status': '1' } // '4' → Inapto | '1' → Venda Realizada
// retLeadChangeStatus = await leadChangeStatus(infLeadChangeStatus);
// console.log(retLeadChangeStatus)

async function leadChangeStatus(inf) {
    let ret = { 'ret': false };
    try {
        let infApi, retApi, infRegex, retRegex, infLog, retLog, time
        let aut = inf && inf.aut ? inf.aut : 'aaaa';
        let login = inf && inf.login ? inf.login : 'aaaa';
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

        let err = `[leadChangeStatus] LOG ${leadId}`
        infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        retLog = await log(infLog);

        if (!retApi.ret || !retApi.res.body.includes('Retorno realizado por')) {
            let err = `[leadChangeStatus] FALSE: retApi 1`
            console.log(err);
            infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            // REAUTENTICAR
            let infLogin, retLogin
            infLogin = { 'aut': aut }
            retLogin = await login(infLogin);
            if (!retLogin.ret) {
                let err = `[leadChangeStatus] FALSE: retLogin 1`
                console.log(err);
                infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLogin }
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
                    if (retApi.res.body.includes('para acessar as funcionalidades')) {
                        let err = `[leadChangeStatus] sem permissão para acessar as funcionalidades`
                        console.log(err);
                        infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        retLog = await log(infLog);
                    } else {
                        let err = `[leadChangeStatus] FALSE: retLogin 2`
                        console.log(err);
                        infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        retLog = await log(infLog);
                        return retApi
                    }
                }
            }
        } else { retApi = retApi.res.body }

        // TESTES [LER ARQUIVO]
        // let infFile, retFile
        // infFile = { 'action': 'read', 'functionLocal': false, 'path': './log/LEAD_CHANGE_STATUS_OK.txt' }
        // retFile = await file(infFile); retApi = retFile.res

        // time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `[leadChangeStatus] DEPOIS de alterar o status`, '\n');
        // infLog = { 'folder': 'Registros', 'path': `leadChangeStatus.txt`, 'text': retApi }
        // retLog = await log(infLog);

        ret['res'] = {
            'leadId': leadId,
            'status': statusOption[statusOk]
        }
        ret['msg'] = `LEAD CHANGE STATUS: OK`
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
    window['leadChangeStatus'] = leadChangeStatus;
} else { // NODEJS
    global['leadChangeStatus'] = leadChangeStatus;
}
