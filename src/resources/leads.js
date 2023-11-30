// let infLeads, retLeads // 'logFun': true,
// infLeads = {
//     'aut': false,
//     'status': [ // 'Retorno realizado' | 'Pendente de retorno' 'Visualizado para retorno'
//         // 'Retorno realizado', // ###### TESTES ######
//         'Pendente de retorno',
//         'Visualizado para retorno',
//     ]
// }
// retLeads = await leads(infLeads);
// console.log(retLeads)

async function leads(inf) {
    let ret = { 'ret': false };
    try {
        let infApi, retApi, infRegex, retRegex, infLog, retLog, time
        let aut = inf && inf.aut ? inf.aut : 'aaaa';
        let login = inf && inf.login ? inf.login : 'aaaa';
        let password = inf && inf.password ? inf.password : 'aaaa';
        let interfaceOk = inf && inf.interface ? inf.interface : 'aaaa';
        let id_interfaceOk = inf && inf.id_interface ? inf.id_interface : 'aaaa';
        let subatualOk = inf && inf.subatual ? inf.subatual : 'aaaa';
        let status = inf && inf.status ? inf.status : ['Retorno realizado']

        // API [LISTA DE LEADS]
        infApi = {
            'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=246`,
            'headers': { 'Cookie': aut, }
        };
        retApi = await api(infApi);
        if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
            let err = `[leads] FALSE: retApi 1`
            console.log(err);
            infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            // REAUTENTICAR
            let infLogin, retLogin
            infLogin = {
                'aut': aut,
                'login': login,
                'password': password,
                'interface': interfaceOk,
                'id_interface': id_interfaceOk,
                'subatual': subatualOk,
            }
            retLogin = await login(infLogin);
            if (!retLogin.ret) {
                let err = `[leads] FALSE: retLogin`
                console.log(err);
                infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retLogin }
                retLog = await log(infLog);
                return retApi
            } else {
                infApi = {
                    'method': 'GET', 'url': `https://interface.telein.com.br/index.php?link=246`,
                    'headers': { 'Cookie': aut, }
                };
                retApi = await api(infApi);
                if (!retApi.ret || !retApi.res.body.includes('tirarverde')) {
                    if (retApi.res.body.includes('para acessar as funcionalidades')) {
                        let err = `[leads] sem permissão para acessar as funcionalidades`
                        console.log(err);
                        infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        retLog = await log(infLog);
                    } else {
                        let err = `[leads] FALSE: retApi 2`
                        console.log(err);
                        infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
                        retLog = await log(infLog);
                        return retApi
                    }
                }
            }
        } else { retApi = retApi.res.body }

        // time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `[leads] DEPOIS da lista de lead`, '\n');
        // infLog = { 'folder': 'Registros', 'path': `leads.txt`, 'text': retApi }
        // retLog = await log(infLog);

        // // TESTES [LER ARQUIVO]
        // let infFile, retFile
        // infFile = { 'action': 'read', 'functionLocal': false, 'path': './log/LEADS.txt' }
        // retFile = await file(infFile); retApi = retFile.res

        // ## LOG ## API [LEADS]
        // let err = `[leads] LOG`
        // infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
        // retLog = await log(infLog);

        // PEGAR [ID LEAD]
        infRegex = { 'pattern': `href="index.php?link=247&id_contato=(.*?)"`, 'text': retApi }
        retRegex = regex(infRegex);
        if (!retRegex.ret || !retRegex.res['5']) {
            ret['msg'] = `Não achou o id do lead`;
            let err = `[leads] ${ret.msg}`
            // console.log(err);
            infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi }
            retLog = await log(infLog);
            return ret
        }
        let leadId = retRegex.res['5']

        // HTML → JSON
        let infHtmlToJson, retHtmlToJson
        infHtmlToJson = { 'randomCol': true, 'html': retApi }
        retHtmlToJson = await htmlToJson(infHtmlToJson);
        if (!retHtmlToJson.ret) {
            let err = `[leads] FALSE: retHtmlToJson`
            console.log(err);
            infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            retLog = await log(infLog);
            return retHtmlToJson
        } else {
            retHtmlToJson = JSON.parse(retHtmlToJson.res)
        }

        // infLog = { 'folder': 'Registros', 'path': `HTML_JSON.txt`, 'text': retHtmlToJson }
        // retLog = await log(infLog);

        // ARRAY COM A LISTA DE LEADS
        let leadsNew = []
        if (!retHtmlToJson.length > 0) {
            let err = `[leads] retHtmlToJson ARRAY VAZIA`
            console.log(err);
            infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
            retLog = await log(infLog);
            return ret
        }

        // ## LOG ## API [LEADS]
        let err = `[leads] LOG`
        infLog = { 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson }
        retLog = await log(infLog);

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
                        'mailing': value.colInd7 ? value.colInd7 : 'null',
                    })
                }
            }
        }

        ret['res'] = leadsNew
        ret['msg'] = `LEADS: OK`
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
    window['leads'] = leads;
} else { // NODEJS
    global['leads'] = leads;
}
