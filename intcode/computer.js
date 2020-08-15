class Computer {
    constructor(memory, readline, input_values, output_values) {
	this.memory = memory;
	this.rl = readline;
	this.i = 0;
	this.input_values = input_values || [];
	this.output_values = output_values;
    }

   async run() {
	while (true) {
	    let instruction = this.memory[this.i];
	    this.i += 1;
	    const opcode = instruction % 100;
	    instruction = Math.floor(instruction / 100);
	    let modes = [];
	    while (instruction > 0) {
		modes.push (instruction % 10);
		instruction = Math.floor(instruction / 10);
	    }
	    switch(opcode) {
	    case 1: {
		this.add(modes);
		break
	    }
	    case 2: {
		this.multiply(modes);
		break;
	    }
	    case 3: {
		await this.getInput(modes);
		break;
	    }
	    case 4: {
		this.output(modes);
		break;
	    }
	    case 5: {
		this.jumpIfTrue(modes);
		break;
	    }
	    case 6: {
		this.jumpIfFalse(modes);
		break;
	    }
	    case 7: {
		this.lessThan(modes);
		break;
	    }
	    case 8: {
		this.equals(modes);
		break;
	    }
	    case 99:
		return this.output_values[0];;
	    default:
		throw "unknown opcode: " + opcode;
	    }
	}
    }

    getArgs(args, modes) {
	for (let a = 0; a < args.length; a++) {
	    let immediate = modes[a] || 0;
	    if (immediate) {
		args[a] = this.i;
	    } else {
		args[a] = this.memory[this.i];
	    }
	    this.i += 1;
	}
    }

    add(modes) {
	let args = new Array(3);
	this.getArgs(args, modes)
	// console.log('add', args);
	this.memory[args[2]] = this.memory[args[0]] + this.memory[args[1]];
    }

    multiply(modes) {
	let args = new Array(3);
	this.getArgs(args, modes);
	// console.log('multiply', args);
	this.memory[args[2]] = this.memory[args[0]] * this.memory[args[1]];
	// console.log('after multiply', this.memory);
    }

    output(modes) {
	let args = new Array(1)
	this.getArgs(args, modes);
	// console.log('getting output from ', args[0]);
	if (this.output_values)
	    this.output_values.push(this.memory[args[0]]);
    }

    async getInput(modes) {
	let args = new Array(1);
	this.getArgs(args, modes);

	if (this.input_values.length) {
	    const input = this.input_values.shift();
	    this.memory[args[0]] = input;
	    return;
	}
	let promise = new Promise((resolve, reject) => {
	    this.rl.question('input: ', (input) => {
//		console.log('got input', input);
 		this.memory[args[0]] = parseInt(input);
		resolve();
	    });
	});
	await promise;
    }

    jumpIfTrue(modes) {
	let args = new Array(2);
	this.getArgs(args, modes);
	if (this.memory[args[0]] !== 0)
	    this.i = this.memory[args[1]];
    }

    jumpIfFalse(modes) {
	let args = new Array(2);
	this.getArgs(args, modes);
	if (this.memory[args[0]] === 0)
	    this.i = this.memory[args[1]];
    }

    lessThan(modes) {
	let args = new Array(3);
	this.getArgs(args, modes);
	if (this.memory[args[0]] < this.memory[args[1]])
	    this.memory[args[2]] = 1;
	else
	    this.memory[args[2]] = 0;
    }


    equals(modes) {
	let args = new Array(3);
	this.getArgs(args, modes);
	if (this.memory[args[0]] === this.memory[args[1]])
	    this.memory[args[2]] = 1;
	else
	    this.memory[args[2]] = 0;
    }

}

module.exports = Computer;
