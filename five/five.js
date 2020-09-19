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
	
	let computer = new Computer(opcodes_orig);
	computer.name = 'A';
	computer.input(1);
	computer.output_callback = (value) => console.log('output: ' + value);
	await computer.run();
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
