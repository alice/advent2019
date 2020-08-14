const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
    rl.close();

    let opcodes_orig = line.split(',').map(x => parseInt(x));
    for (let noun = 0; noun <= 99; noun++) {
	for (let verb = 0; verb <= 99; verb++) {
	    let opcodes = opcodes_orig.slice();
	    opcodes[1] = noun;
	    opcodes[2] = verb;
	    run(opcodes);
	    if (opcodes[0] === 19690720) {
		console.log('noun: ', noun, ', verb: ', verb);
		console.log('answer: ', (100*noun) + verb);
		return;
	    }
	}
    }
    console.log('couldn\'t find an answer');
    return;
});

function run(opcodes) {
    let i = 0;
    while (true) {
	let opcode = opcodes[i];
	i += 1;
	switch(opcode) {
	case 1: {
	    i = performAdd(opcodes, i);
	    break
	}
	case 2: {
	    i = performMultiply(opcodes, i);
	    break;
	}
	case 99:
	    return;
	default:
	    throw "unknown opcode: " + opcode;
	}
    }
}

function performAdd(opcodes, i) {
    let input1 = opcodes[i++];
    let input2 = opcodes[i++];
    let output = opcodes[i++];
    opcodes[output] = opcodes[input1] + opcodes[input2];
    return i;
}

function performMultiply(opcodes, i) {
    let input1 = opcodes[i++];
    let input2 = opcodes[i++];
    let output = opcodes[i++];
    opcodes[output] = opcodes[input1] * opcodes[input2];
    return i;
}
