async function runPm2() {
    let { exec } = await import('child_process'); let _exec = exec
    let child, runPm2, retRunCommand, par1 = process.argv[2], par2 = process.argv[3]
    if (!par1 || !par2) {
        console.log('INFORME O NODE E ARQUIVO')
    } else {
        async function runCommand(inf) {
            return await new Promise((resolve) => {
                child = _exec(inf, async (error, stdout, stderr) => {
                    if (error && stderr) {
                        resolve(stderr);
                    } else {
                        if (stdout) {
                            resolve(stdout);
                        }
                    }
                    resolve(false);
                    return;
                });
                child.stdout.on('data', () => { });
                child.stderr.on('data', () => { });
            });
        }
        runPm2 = par2
        retRunCommand = await runCommand(`pm2 list`)
        if (retRunCommand.includes(`NS_${runPm2.replace(/[^a-zA-Z0-9\/\.]/g, '')}`)) {
            retRunCommand = await runCommand(`pm2 stop NS_${runPm2.replace(/[^a-zA-Z0-9\/\.]/g, '')}`)
            if (retRunCommand.includes('[PM2][ERROR]')) {
                console.log(retRunCommand)
                return
            }
            retRunCommand = await runCommand(`pm2 delete NS_${runPm2.replace(/[^a-zA-Z0-9\/\.]/g, '')}`)
            if (retRunCommand.includes('[PM2][ERROR]')) {
                console.log(retRunCommand)
                return
            }
            console.log(`ENCERRADO COM SUCESSO ${runPm2}`)
        } else {
            retRunCommand = await runCommand(`pm2 start ${runPm2} --name NS_${runPm2.replace(/[^a-zA-Z0-9\/\.]/g, '')} --interpreter ${par1}`)
            if (retRunCommand.includes('[PM2][ERROR]')) {
                console.log(retRunCommand)
                return
            }
            console.log(`INICIADO COM SUCESSO ${runPm2}`)
        }
    }

}
runPm2();