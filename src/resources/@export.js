let gloWin = eng ? window : global; // [true] CHROME | [false] NODEJS
// DEFINIR O 'devChildren' → [CHROME] EMAIL DO USUÁRIO | [NODEJS] PRIMEIRO ARQUIVO A SER EXECUTADO (NA MAIORIA DOS CASOS 'server')
let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false
if (eng) { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(function (u) { resolve(u.email) }) }) }

// @functions
await import(`../../../${process.env.fileChrome_Extension.split('PROJETOS\\')[1]}/src/resources/@functions.js`);

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await getPath({ 'e': new Error(), 'devChildren': devChildren })

// console.log(eng, '-', engName, '-', letter); console.log("#################"); console.log('securityPass:', globalWindow.securityPass);
// console.log('portWeb:', globalWindow.portWeb, '|', 'serverWeb:', globalWindow.serverWeb); console.log('portLoc:', globalWindow.portLoc, '|', 'serverLoc:', globalWindow.serverLoc);
// console.log('devMaster:', globalWindow.devMaster, '|', 'devSlave:', globalWindow.devSlave, '|', 'devChildren:', globalWindow.devChildren);
// console.log('devSend:', globalWindow.devSend); console.log('devGet:', globalWindow.devGet); console.log('conf:', globalWindow.conf);
// console.log('root:', globalWindow.root); console.log('functions:', globalWindow.functions); console.log('project:', globalWindow.project);

// IMPORTAR FUNÇÕES DINAMICAMENTE QUANDO NECESSÁRIO 
let qtd = 0; async function functionImport(infOk) { let { name, path, inf } = infOk; qtd++; if (qtd > 30) { console.log('IMP...', name) }; await import(`${path}`); return await gloWin[name](inf) }

// FUNÇÃO GENÉRICA (QUANDO O ENGINE ESTIVER ERRADO) | ENCAMINHAR PARA DEVICE
async function functionGeneric(infOk) { let { name, inf, retInf } = infOk; let retDevAndFun = await devFun({ 'e': import.meta.url, 'enc': true, 'data': { 'name': name, 'par': inf, 'retInf': retInf, } }); return retDevAndFun }

// FUNÇÕES DESSE PROJETO
gloWin['leadChangeStatus'] = (inf) => { let fun = (!eng) ? functionImport : functionGeneric; return fun({ 'name': 'leadChangeStatus', 'path': './leadChangeStatus.js', 'inf': inf }); };
gloWin['leadGet'] = (inf) => { let fun = (!eng) ? functionImport : functionGeneric; return fun({ 'name': 'leadGet', 'path': './leadGet.js', 'inf': inf }); };
gloWin['leads'] = (inf) => { let fun = (!eng) ? functionImport : functionGeneric; return fun({ 'name': 'leads', 'path': './leads.js', 'inf': inf }); };
gloWin['leadsJsf'] = (inf) => { let fun = (!eng) ? functionImport : functionGeneric; return fun({ 'name': 'leadsJsf', 'path': './leadsJsf.js', 'inf': inf }); };
gloWin['login'] = (inf) => { let fun = (!eng) ? functionImport : functionGeneric; return fun({ 'name': 'login', 'path': './login.js', 'inf': inf }); };
