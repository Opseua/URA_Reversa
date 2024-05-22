// DEFINIR O 'devChildren' → [CHROME] EMAIL DO USUÁRIO | [NODEJS] PRIMEIRO ARQUIVO A SER EXECUTADO (NA MAIORIA DOS CASOS 'server')
let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false
if (typeof window !== 'undefined') { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(function (u) { resolve(u.email) }) }) }

// @functions
await import(`../../../${process.env.fileChrome_Extension.split('PROJETOS\\')[1]}/src/resources/@functions.js`);

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
let retGetPath = await getPath({ 'e': new Error(), 'devChildren': devChildren })

// console.log(eng, '-', engName, '-', cng, '-', letter); console.log("#################")
// console.log('securityPass:', globalWindow.securityPass)
// console.log('portWeb:', globalWindow.portWeb, '|', 'serverWeb:', globalWindow.serverWeb)
// console.log('portLoc:', globalWindow.portLoc, '|', 'serverLoc:', globalWindow.serverLoc)
// console.log('devMaster:', globalWindow.devMaster, '|', 'devSlave:', globalWindow.devSlave, '|', 'devChildren:', globalWindow.devChildren)
// console.log('devSend:', globalWindow.devSend)
// console.log('devGet:', globalWindow.devGet)
// console.log('conf:', globalWindow.conf)
// console.log('root:', globalWindow.root)
// console.log('functions:', globalWindow.functions)
// console.log('project:', globalWindow.project)

// FUNÇÕES DESSE PROJETO
await import('./leadChangeStatus.js')
await import('./leadGet.js')
await import('./leads.js')
await import('./leadsJsf.js')
await import('./login.js')
