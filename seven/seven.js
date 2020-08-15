const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    crlfDelay: Infinity
});
const Computer = require('../intcode/computer.js');

const settings = [0, 1, 2, 3, 4];

rl.on('line', async (line) => {
    let program = line.split(',').map(x => parseInt(x));
    let signal = 0;

    let max = await trySettings(settings.slice(), program, signal);

    console.log('max: ', max);
    rl.close();
});

async function trySettings(settings, program, signal) {
    let max = 0;
    for (let i = 0; i < settings.length; i++) {
	let setting = settings.splice(i, 1)[0];
	let computer = new Computer(program, rl, [setting, signal], []);
	let output = await computer.run();
	if (settings.length > 0)
	    max = Math.max(max, await trySettings(settings.slice(), program, output));
	else
	    max = Math.max(max, output);
	settings.splice(i, 0, setting);
    }
    return max;
}

