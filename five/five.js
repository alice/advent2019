const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    crlfDelay: Infinity
});
const Computer = require('../intcode/computer.js');

(async () => {

    rl.on('line', async (line) => {
	let opcodes_orig = line.split(',').map(x => parseInt(x));
	console.log('opcodes_orig', opcodes_orig);
	
	let computer = new Computer(opcodes_orig, rl, [1], []);
	output_value = await computer.run();
	console.log('output_value: ' + output_value);
	rl.close();
    });

    let closePromise = new Promise((resolve, reject) => {
	rl.on('close', () => {
	    resolve();
	});
    });
    await closePromise;
}
)();
