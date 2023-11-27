async function leadChangeStatus(inf) {
    let ret = { 'ret': false };
    try {
        let infApi, retApi, infRegex, retRegex, infConfigStorage, retConfigStorage
        // PEGAR O AUT DO CONFIG
        infConfigStorage = { 'action': 'get', 'functionLocal': false, 'key': 'telein' } // 'functionLocal' SOMENTE NO NODEJS
        retConfigStorage = await configStorage(infConfigStorage);
        if (!retConfigStorage.ret) {
            console.log('[leadChangeStatus] FALSE: retConfigStorage');
            return retConfigStorage
        } else {
            retConfigStorage = retConfigStorage.res
        }
        let aut = inf && inf.aut ? inf.aut : retConfigStorage.aut
        let leadId = inf && inf.leadId ? inf.leadId : `25787539`
        let statusOption = {
            '1': 'Venda Realizada', '2': 'Sem interesse ', '3': 'Não era o cliente', '4': 'Inapto',
            '5': 'Não atende', '6': 'Caixa postal ', '7': 'Cliente vai analisar a proposta', '8': 'Solicitou contato depois',
            '9': 'Tratando no Whatsapp', '10': 'Aguardando Documento', '11': 'Cliente da Base ', '12': 'Fora de cobertura',
        }
        let status = inf && inf.status ? inf.status : '4'

        // API [ALTERAR STATUS DO LEAD]
        infApi = {
            'method': 'POST', 'url': `https://interface.telein.com.br/index.php?link=247&tipo=sucesso&id_contato=${leadId}`,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'headers': { 'Cookie': aut, },
            'body': `tabulacao=${status}`
        };
        // retApi = await api(infApi);
        // if (!retApi.ret || !retApi.res.body.includes('Retorno realizado por')) {
        //     console.log('[leadChangeStatus] FALSE: retApi');
        //     if (!retApi.res.body.includes('E-mail ou login')) {
        //         console.log('[leadChangeStatus] FALSE: retApi');
        //         let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leadChangeStatus_NAO_ACHOU_A_INF_DO_LEAD_1.txt`, 'text': retApi }
        //         let retLog = await log(infLog);
        //         return retApi
        //     } else {
        //         // REAUTENTICAR
        //         let infLogin, retLogin
        //         infLogin = { 'aut': false }
        //         retLogin = await login(infLogin);
        //         if (!retLogin.ret) {
        //             console.log('[leadChangeStatus] FALSE: retLogin');
        //             let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leadChangeStatus_NAO_CONSEGUIU_LOGAR.txt`, 'text': retApi }
        //             let retLog = await log(infLog);
        //             return retApi
        //         } else {
        //             infApi = {
        //                 'method': 'POST', 'url': `https://interface.telein.com.br/index.php?link=247&tipo=sucesso&id_contato=${leadId}`,
        //                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        //                 'headers': { 'Cookie': aut, },
        //                 'body': `tabulacao=${status}`
        //             };
        //             retApi = await api(infApi);
        //             if (!retApi.ret || !retApi.res.body.includes('Retorno realizado por')) {
        //                 console.log('[leadChangeStatus] FALSE: retLogin');
        //                 let infLog = { 'folder': 'URA_Reversa', 'functionLocal': true, 'path': `leadChangeStatus_NAO_ACHOU_A_INF_DO_LEAD_2.txt`, 'text': retApi }
        //                 let retLog = await log(infLog);
        //                 return retApi
        //             }
        //         }
        //     }
        // } else { retApi = retApi.res.body }

        // TESTES [LER ARQUIVO]
        let infFile, retFile
        infFile = { 'action': 'read', 'functionLocal': false, 'path': './log/LEAD_CHANGE_STATUS_OK.txt' }
        retFile = await file(infFile); retApi = retFile.res

        ret['res'] = {
            'leadId': leadId,
            'status': statusOption[status]
        }
        ret['msg'] = `LEAD CHANGE STATUS: OK`
        ret['ret'] = true
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
