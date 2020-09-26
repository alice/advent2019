const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    crlfDelay: Infinity
});
const Computer = require('../intcode/computer.js');

rl.on('line', async (line) => {
    let program = line.split(',').map((x) => {
	let n = BigInt(x);
	if (n <= BigInt(Number.MAX_SAFE_INTEGER))
	    return Number(n);
	return n;
    });
    let signal = 0;
    let computer = new Computer(program, [1]);
    computer.output_callback = (output) => { console.log("output:", output); };
    computer.run();

    rl.close();
});
