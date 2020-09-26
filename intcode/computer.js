const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;
const RELATIVE_MODE = 2;

class Computer {
    constructor(memory, input_values) {
	this.memory = memory;
	this.i = 0;
	this.relative_base = 0;
	this.input_values = input_values || [];
	this.input_callbacks = [];
	this.output_callback = console.log;
	this.last_output = null;
    }

    input(input) {
	if (this.input_callbacks.length > 0) {
	    console.log(this.name,  'got input', input, 'via input method');
	    this.input_callbacks.pop().call(this, input);
	    return;
	}
	this.input_values.push(input);
    }

    get(address) {
	if (address < 0) {
	    throw('get: invalid address: ' + address);
	    return;
	}

	if (address < this.memory.length)
	    return this.memory[address];

	this.memory[address] = 0;
	return 0;
    }

    set(address, value) {
	if (value === undefined) {
	    console.log('setting undefined');
	    console.trace();
	    throw('setting undefined');
	}
	if (address > 0) {
	    this.memory[address] = value;
	    return;
	}
	console.trace()
	throw('set: invalid address: ' + address);
    }	    

    async run() {
	while (true) {
	    let instruction = this.get(this.i);
	    this.i += 1;
	    const opcode = instruction % 100;
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
	    case 9: {
		this.adjustRelativeBase(modes);
		break;
	    }
	    case 99:
		return true;
	    default:
		throw "unknown opcode: " + opcode;
	    }
	}
    }

    getArgs(args, modes) {
	for (let a = 0; a < args.length; a++) {
	    let mode = modes[a] || 0;
	    switch (mode) {
	    case IMMEDIATE_MODE:
		args[a] = this.i;
		break;
	    case RELATIVE_MODE: {
		args[a] = this.get(this.i) + this.relative_base;
		break;
	    }
	    case POSITION_MODE:
	    default:
		args[a] = this.get(this.i);
		break;
	    }
	    this.i += 1;
	}
    }

    add(modes) {
	let args = new Array(3);
	this.getArgs(args, modes);
	this.set(args[2], this.get(args[0]) + this.get(args[1]));
    }

    multiply(modes) {
	let args = new Array(3);
	this.getArgs(args, modes);
	this.set(args[2], this.get(args[0]) * this.get(args[1]));
    }
    
    output(modes) {
	let args = new Array(1)
	this.getArgs(args, modes);
	this.output_callback.call(null, this.get(args[0]));
    }

    input_promise() {
	let callbacks = this.input_callbacks;
	let input_values = this.input_values;
	let promise = new Promise((resolve, reject) => {
	    if (input_values.length > 0) {
                resolve(this.input_values.shift());
		return;
	    } else {
		this.input_callbacks.push(resolve);
	    }
	});
	return promise;
    }

    async getInput(modes) {
	let args = new Array(1);
	this.getArgs(args, modes);
	let address = args[0];

	const input = await this.input_promise();
	this.set(address, input);
    }

    jumpIfTrue(modes) {
	let args = new Array(2);
	this.getArgs(args, modes);
	if (this.get(args[0]) !== 0)
	    this.i = this.get(args[1]);
    }

    jumpIfFalse(modes) {
	let args = new Array(2);
	this.getArgs(args, modes);
	if (this.get(args[0]) === 0)
	    this.i = this.get(args[1]);
    }

    lessThan(modes) {
	let args = new Array(3);
	this.getArgs(args, modes);
	if (this.get(args[0]) < this.get(args[1]))
	    this.set(args[2], 1);
	else
	    this.set(args[2], 0);
    }


    equals(modes) {
	let args = new Array(3);
	this.getArgs(args, modes);
	if (this.get(args[0]) === this.get(args[1]))
	    this.set(args[2], 1);
	else
	    this.set(args[2], 0);
    }

    adjustRelativeBase(modes) {
	let args = new Array(1);
	this.getArgs(args, modes);
	this.relative_base += this.get(args[0]);
    }
}

module.exports = Computer;
