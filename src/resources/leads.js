// let infLeads, retLeads
// infLeads = {
//     'e': e,
//     'aut': false,
//     'status': [ // 'Retorno realizado' | 'Pendente de retorno' 'Visualizado para retorno'
//         // 'Retorno realizado', // ###### TESTES ######
//         'Pendente de retorno',
//         'Visualizado para retorno',
//     ]
// }
// retLeads = await leads(infLeads); console.log(retLeads)

let e = import.meta.url, ee = e;
async function leads(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let infApi, retApi, infRegex, retRegex, infLog, err
        let aut = inf && inf.aut ? inf.aut : 'aaaa';
        let loginOk = inf && inf.login ? inf.login : 'aaaa';
        let password = inf && inf.password ? inf.password : 'aaaa';
        let interfaceOk = inf && inf.interface ? inf.interface : 'aaaa';
        let id_interfaceOk = inf && inf.id_interface ? inf.id_interface : 'aaaa';
        let subatualOk = inf && inf.subatual ? inf.subatual : 'aaaa';
        let status = inf && inf.status ? inf.status : ['Retorno realizado']

        // API [LISTA DE LEADS]
        infApi = {
            'e': e, 'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=246`,
            'headers': { 'Cookie': aut, }
        };
        retApi = await api(infApi);
        if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
            err = `% [leads] FALSE: retApi 1`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            await log(infLog);
            // REAUTENTICAR
            let infLogin, retLogin
            infLogin = {
                'e': e,
                'aut': aut,
                'login': loginOk,
                'password': password,
                'interface': interfaceOk,
                'id_interface': id_interfaceOk,
                'subatual': subatualOk,
            }
            retLogin = await login(infLogin);
            if (!retLogin.ret) {
                err = `% [leads] FALSE: retLogin`
                logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
                infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLogin }
                await log(infLog);
                return retApi
            } else {
                infApi = {
                    'e': e, 'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=246`,
                    'headers': { 'Cookie': aut, }
                };
                retApi = await api(infApi);
                if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
                    if (retApi.res && retApi.res.body.includes('para acessar as funcionalidades')) {
                        err = `% [leads] sem permissão para acessar as funcionalidades`
                        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
                        infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        await log(infLog);
                        return ret
                    } else {
                        err = `% [leads] FALSE: retApi 2`
                        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
                        infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        await log(infLog);
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
        err = `% [leads] LOG retApi`
        infLog = { 'e': e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        await log(infLog);

        // PEGAR [ID LEAD]
        infRegex = { 'e': e, 'pattern': `index.php?link=247&id_contato=(.*?)"`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['5']) {
            ret['msg'] = `LEAD: ERRO | NÃO ACHOU O ID DO LEAD`;
            err = `% [leads] ${ret.msg}`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            await log(infLog);
            return ret
        }
        let leadId = retRegex.res['5']

        // HTML → JSON
        let infHtmlToJson, retHtmlToJson
        infHtmlToJson = { 'e': e, 'randomCol': true, 'html': retApi }
        retHtmlToJson = await htmlToJson(infHtmlToJson);
        if (!retHtmlToJson.ret) {
            err = `% [leads] FALSE: retHtmlToJson`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            await log(infLog);
            return retHtmlToJson
        } else {
            retHtmlToJson = JSON.parse(retHtmlToJson.res)
        }

        // infLog = { 'e': e, 'folder': 'Registros', 'path': `HTML_JSON.txt`, 'text': retHtmlToJson }
        // await log(infLog);

        // ARRAY COM A LISTA DE LEADS
        let leadsNew = []
        if (!retHtmlToJson.length > 0) {
            err = `% [leads] retHtmlToJson ARRAY VAZIA`
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `${err}` })
            infLog = { 'e': e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            await log(infLog);
            return ret
        }

        // ## LOG ## retHtmlToJson
        err = `% [leads] LOG retHtmlToJson`
        infLog = { 'e': e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
        await log(infLog);

        for (let [index, value] of retHtmlToJson.entries()) {
            // ###########################
            if (status.includes(value.colInd4)) {
                let time = dateHour().res // 300
                let timeStamp = Date.parse(value.colInd0) / 1000
                let dif = Number(time.tim) - timeStamp
                if (dif > 300) { // 5 MINUTOS ATRÁS
                    let data = new Date(value.colInd0);
                    let day = data.getDate().toString().padStart(2, '0');
                    let mon = (data.getMonth() + 1).toString().padStart(2, '0');
                    let yea = data.getFullYear().toString();
                    let hou = data.getHours().toString().padStart(2, '0');
                    let min = data.getMinutes().toString().padStart(2, '0');
                    let sec = data.getSeconds().toString().padStart(2, '0');
                    data = `${day}/${mon}/${yea} ${hou}:${min}:${sec}`;
                    leadsNew.push({
                        'leadId': leadId[index] ? leadId[index] : 'null',
                        'date': data,
                        'status': value.colInd4 ? value.colInd4 : 'null',
                        'telAbrev': value.colInd1 ? value.colInd1 : 'null',
                        'mailing': value.colInd7 ? value.colInd7.replace(/�/g, '') : 'null',
                    })
                }
            }
        }

        ret['res'] = leadsNew
        ret['msg'] = `LEADS: OK`
        ret['ret'] = true

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['leads'] = leads;