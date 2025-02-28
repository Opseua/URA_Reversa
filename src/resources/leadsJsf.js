// let infLeads, retLeads;
// infLeads = {
//     e, 'aut': false,
//     'status': [ // 'Retorno realizado' | 'Pendente de retorno' 'Visualizado para retorno'
//         // 'Retorno realizado', // ###### TESTES ######
//         'Pendente de retorno', 'Visualizado para retorno',
//     ],
// };
// retLeads = await leads(infLeads); console.log(retLeads);

let e = import.meta.url, ee = e;
async function leadsJsf(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let retApi, retRegex, err, time = dateHour().res, retGoogleSheets;
        let aut = inf && inf.autJsf ? inf.autJsf : 'aaaa';

        // DADOS GLOBAIS DA PLANILHA E FAZER O PARSE
        gO.inf['id'] = '1UzSX3jUbmGxVT4UbrVIB70na3jJ5qYhsypUeDQsXmjc'; gO.inf['tab'] = 'INDICAR_AUTOMATICO';
        let range = 'A2', id = gO.inf.id, tab = gO.inf.tab;
        retGoogleSheets = await googleSheets({ e, 'action': 'get', id, tab, range, });
        if (!retGoogleSheets.ret) {
            err = `$ Erro ao pegar-enviar dados para planilha`; logConsole({ e, ee, 'msg': `${err}`, }); await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retGoogleSheets, });
            return retGoogleSheets;
        } else { retGoogleSheets = retGoogleSheets.res[0][0]; }
        gO.inf['json'] = JSON.parse(retGoogleSheets);

        // ÚLTIMO LEAD QUE FOI PEGO NO JSF
        let conSplInf = inf && inf.conSpl ? inf.conSpl : gO.inf.json['conSpl']; let lastLead = inf && inf.lastLeadURA_ReversaJsf ? inf.lastLeadURA_ReversaJsf : gO.inf.json['lastLeadURA_ReversaJsf'];

        // DATA INICIAL À 5 DIAS ATRÁS
        let timeSta = dateHour(`-${(86400 * 5)}`).res; let timeEnd = dateHour().res; let url = `http://177.87.122.53/azcall/relatorio/relTbu.php?dt_inicial=${timeSta.day}/${timeSta.mon}/2025%200:00&dt_final=${timeEnd.day}/${timeEnd.mon}/2025%2023:59&telefone=&telefonetype=1&nome=&camp=&digito=1&nometype=1&Camp[]=&&pagina=1&button4=pesquisar`;

        // API [LISTA DE LEADS]
        retApi = await api({ e, 'method': 'GET', url, 'headers': { 'Cookie': aut, }, });

        if (!retApi.ret || !retApi.res.body.includes('Campanha')) {
            err = `% [leads] FALSE: retApi 1`; // logConsole({ e, ee, 'msg': `${err}` })
            await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi, });
            return ret;
        } else { retApi = retApi.res.body; }

        // ## LOG ## retApi
        err = `% [leads] LOG retApi`; await log({ e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi, });

        // PEGAR A TABELA
        retRegex = regex({ e, 'pattern': `<table(.*?)</table>`, 'text': retApi, });
        if (!retRegex.ret || !retRegex.res['3']) {
            ret['msg'] = `LEADS JSF: ERRO | NÃO ACHOU A TABELA`; err = `% [leads] ${ret.msg}`; // logConsole({ e, ee, 'msg': `${err}` })
            await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retApi, });
            return ret;
        }
        retRegex = `<table${retRegex.res['3']}</table>`;

        // HTML → JSON
        let retHtmlToJson = await htmlToJson({ e, 'mode': '2', 'html': retRegex, });
        if (!retHtmlToJson.ret || retHtmlToJson.res.length < 1) {
            err = `% [leads] FALSE: retHtmlToJson`; // logConsole({ e, ee, 'msg': `${err}` })
            await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson, });
            return retHtmlToJson;
        } else { retHtmlToJson = JSON.parse(retHtmlToJson.res); }

        // ARRAY COM A LISTA DE LEADS
        let leadsNew = [];
        if (!retHtmlToJson.length > 0) {
            err = `% [leads] retHtmlToJson ARRAY VAZIA`; // logConsole({ e, ee, 'msg': `${err}` })
            await log({ e, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson, });
            return ret;
        }

        // ## LOG ## retHtmlToJson
        err = `% [leads] LOG retHtmlToJson`; await log({ e, 'raw': true, 'folder': 'Registros', 'path': `${err}.txt`, 'text': retHtmlToJson, });

        // PEGAR LEADS
        let sendLeads = (lastLead === 'NADA');
        function newLeads() {
            for (let [index, value,] of retHtmlToJson.reverse().entries()) {
                // PEGAR O LEAD
                if (sendLeads) {
                    let partes = value.col2.split(' '); let data = partes[0].split('/'); let hora = partes[1].split(':'); let day = parseInt(data[0], 10).toString().padStart(2, '0');
                    let mon = parseInt(data[1], 10).toString().padStart(2, '0'); let yea = parseInt(data[2], 10).toString().padStart(4, '0'); let hou = parseInt(hora[0], 10).toString().padStart(2, '0');
                    let min = parseInt(hora[1], 10).toString().padStart(2, '0'); let sec = parseInt(hora[2], 10).toString().padStart(2, '0'); data = `${day}/${mon}/${yea} ${hou}:${min}:${sec}`;
                    let leadId = `${yea}-${mon}-${day}_${hou}.${min}.${sec}-${value.col4}`; let tel = value.col4 ? value.col4 : 'null'; let cnpj = value.col3 ? value.col3 : 'null';
                    let razaoSocial = value.col5 ? value.col5 : 'null'; let email = `sem@gmail.com`; let administrador = razaoSocial; let mailing = value.col6 ? value.col6 : 'null';
                    leadsNew.push({
                        leadId,
                        data,
                        tel,
                        cnpj,
                        razaoSocial,
                        email,
                        administrador,
                        mailing,
                    });
                }
                // PERMITIR NOVOS LEADS (MANTER NO FINAL!!!)
                if (lastLead.includes(`${value.col3}${conSplInf}${value.col4}`)) {
                    sendLeads = true;
                }
            }
        }
        newLeads();

        // PEGAR TODOS OS LEADS DA PÁGINA (SE NÃO ENCONTRAR O 'lastLead')
        if (leadsNew.length === 0 && !sendLeads) {
            sendLeads = true; newLeads();
        }

        ret['res'] = leadsNew;
        ret['msg'] = `LEADS: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODEJS
(eng ? window : global)['leadsJsf'] = leadsJsf;


