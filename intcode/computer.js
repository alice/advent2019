class Computer {
    constructor(memory, input_values) {
	this.memory = memory;
	console.log('constructed computer with', memory.length, 'instructions');
	this.i = 0;
	this.input_values = input_values || [];
	this.input_callbacks = [];
	this.output_callback = console.log;
	this.last_output = null;
    }

    input(input) {
	console.log('input function called on', this.name);
	console.log(this.name, this.input_callbacks.length, 'input_callbacks');
	if (this.input_callbacks.length > 0) {
	    console.log(this.name,  'got input', input, 'via input method');
	    this.input_callbacks.pop().call(this, input);
	    return;
	}
	console.log('no awaiting callback on', this.name);
	this.input_values.push(input);
    }

    get(address) {
	if (address < this.memory.length)
	    return this.memory[address];
	console.trace()
	throw('get: invalid address: ' + address);
    }

    set(address, value) {
	if (value === undefined) {
	    console.log('setting undefined');
	    console.trace();
	    throw('setting undefined');
	}
	console.log('set on', this.name);
	if (address < this.memory.length) {
	    this.memory[address] = value;
	    return;
	}
	console.trace()
	throw('set: invalid address: ' + address);
    }	    

    async run() {
	console.log('run ' + this.name);
	while (true) {
	    let instruction = this.get(this.i);
	    this.i += 1;
	    const opcode = instruction % 100;
	    console.log(this.name, 'opcode', opcode);
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
		return true;
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
		args[a] = this.get(this.i);
	    }
	    this.i += 1;
	}
    }

    add(modes) {
	let args = new Array(3);
	this.getArgs(args, modes);
	console.log(this.name, 'add', args, 'this.set(', args[2], ',',
		    this.get(args[0]), '+', this.get(args[1]), ')');
	this.set(args[2], this.get(args[0]) + this.get(args[1]));
    }

    multiply(modes) {
	let args = new Array(3);
	this.getArgs(args, modes);
	console.log(this.name, 'multiply', args, 'this.set(', args[2], ', ',
		    this.get(args[0]), '*',  this.get(args[1]), ')');
	this.set(args[2], this.get(args[0]) * this.get(args[1]));
    }
    
    output(modes) {
	let args = new Array(1)
	this.getArgs(args, modes);
	console.log(this.name, 'output', args, this.memory[args[0]]);
	this.output_callback.call(null, this.get(args[0]));
    }

    input_promise() {
	let callbacks = this.input_callbacks;
	let input_values = this.input_values;
	let promise = new Promise((resolve, reject) => {
	    if (input_values.length > 0) {
		console.log(this.name, 'got input', input_values[0], 'from input_values')
                resolve(this.input_values.shift());
		return;
	    } else {
		console.log(this.name + ' awaiting input');
		this.input_callbacks.push(resolve);
		console.log(this.name, this.input_callbacks.length, 'input_callbacks');
	    }
	});
	return promise;
    }

    async getInput(modes) {
	let args = new Array(1);
	this.getArgs(args, modes);
	let address = args[0];

	const input = await this.input_promise();
	console.log('got input', input, 'on', this.name)
	this.set(address, input);
    }

    jumpIfTrue(modes) {
	let args = new Array(2);
	this.getArgs(args, modes);
	console.log(this.name, 'jumpIfTrue', args, this.memory[args[0]], this.memory[args[1]]);
	if (this.get(args[0]) !== 0)
	    this.i = this.get(args[1]);
    }

    jumpIfFalse(modes) {
	let args = new Array(2);
	this.getArgs(args, modes);
	console.log(this.name, 'jumpIfFalse', args, this.memory[args[0]], this.memory[args[1]]);
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

}

module.exports = Computer;
