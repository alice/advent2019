class Computer {
    constructor(memory, input_values) {
	this.memory = memory;
	this.i = 0;
	this.input_values = input_values || [];
	this.input_callbacks = [];
	this.output_callback = console.log;
	this.last_output = null;
    }

    input(input) {
	if (this.input_callbacks.length > 0) {
	    this.input_callbacks.pop().call(input);
	    return;
	}
	this.input_values.push(input);
    }

    async run() {
	console.log('run ' + this.name);
	while (true) {
	    let instruction = this.memory[this.i];
	    this.i += 1;
	    const opcode = instruction % 100;
	    console.log('opcode ' + opcode + ' on ' + this.name);
	    instruction = Math.floor(instruction / 100);
	    let modes = [];
	    while (instruction > 0) {
		modes.push(instruction % 10);
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
		return;
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
	this.getArgs(args, modes);
	console.log('add', args);
	console.log('memory[' + args[2] + '] = ' + this.memory[args[0]] + ' + ' + this.memory[args[1]]);
	this.memory[args[2]] = this.memory[args[0]] + this.memory[args[1]];
    }

    multiply(modes) {
	let args = new Array(3);
	this.getArgs(args, modes);
	this.memory[args[2]] = this.memory[args[0]] * this.memory[args[1]];
    }
    
    output(modes) {
	console.log(this.name + ' output');
	let args = new Array(1)
	this.getArgs(args, modes);
	this.output_callback.call(this.memory[args[0]]);
    }

    input_promise() {
	let callbacks = this.input_callbacks;
	let input_values = this.input_values;
	let promise = new Promise((resolve, reject) => {
	    if (input_values.length > 0) {
		resolve(input_values.shift());
	    } else {
		console.log(this.name + ' awaiting input');
		callbacks.shift(resolve);
	    }
	});
	return promise;
    }

    async getInput(modes) {
	let args = new Array(1);
	this.getArgs(args, modes);
	let address = this.memory[args[0]];

	const input = await this.input_promise();
	console.log(this.name + ' got input ' + input);
	this.memory[address] = input;
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
