// FUNCTIONS
await import('../../../Chrome_Extension/src/resources/@functions.js');

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
let retGetPathNew = await getPathNew({ 'e': new Error(), 'isFunction': false, 'devSlave': cng == 1 ? 'CHROME' : 'URA_REVERSA' })

// FUNÇÕES DESSE PROJETO
await import('./leadChangeStatus.js')
await import('./leadGet.js')
await import('./leads.js')
await import('./leadsJsf.js')
await import('./login.js')
