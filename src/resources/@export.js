// FUNCTIONS
await import('../../../Chrome_Extension/src/resources/@functions.js');

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
let retGetPathNew = await getPathNew({ 'e': new Error(), 'isFunction': false, })
// globalWindow.devResWs = cng == 1 ? 'CHROME' : 'NODEJS';

// FUNÇÕES DESSE PROJETO
await import('./leadChangeStatus.js')
await import('./leadGet.js')
await import('./leads.js')
await import('./leadsJsf.js')
await import('./login.js')
