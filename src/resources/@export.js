globalThis['eng'] = (typeof globalThis.alert !== 'undefined'); // [true] CHROME | [false] NODE

// DEFINIR O 'devChildren' → [CHROME] MODO ANÔNIMO → null / MODO NORMAL (SEM EMAIL) → false / MODO NORMAL (COM EMAIL) → email@gmail.com | [NODE] PRIMEIRO ARQUIVO A SER EXECUTADO (MAIORIA DOS CASOS 'server')
let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false;
if (eng) { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(u => { if (chrome.runtime.lastError) { resolve(null); return; } resolve(u.email || false); }); }); }

// @functions
await import(`../../../${process.env.fileChrome_Extension.split('PROJETOS\\')[1]}/src/resources/@functions.js`);

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await getPath({ 'e': new Error(), devChildren, });

/* FUNÇÕES */ let project = gW.project;
globalThis['leadChangeStatus'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/leadChangeStatus.js`, inf, project, }); };
globalThis['leadGet'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/leadGet.js`, inf, project, }); };
globalThis['leads'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/leads.js`, inf, project, }); };
globalThis['leadsJsf'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/leadsJsf.js`, inf, project, }); };
globalThis['login'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/login.js`, inf, project, }); };


