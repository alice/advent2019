const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const Computer = require('../intcode/computer.js');

rl.on('line', (line) => {
    rl.close();

    let opcodes_orig = line.split(',').map(x => parseInt(x));
    console.log(opcodes_orig);
    for (let noun = 0; noun <= 99; noun++) {
	for (let verb = 0; verb <= 99; verb++) {
	    let opcodes = opcodes_orig.slice();
	    opcodes[1] = noun;
	    opcodes[2] = verb;
	    let computer = new Computer(opcodes);
	    computer.run();
	    if (opcodes[0] === 19690720) {
		console.log('noun: ', noun, ', verb: ', verb);
		console.log('answer: ', (100*noun) + verb);
		return;
	    }
	}
    }
    console.log('couldn\'t find an answer');
    console.log(computer.memory);
    return;
});

