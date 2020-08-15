class Computer {
    constructor(memory, readline) {
	this.memory = memory;
	this.rl = readline;
	this.i = 0;
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
	console.log('output:', this.memory[args[0]]);
    }

    async getInput(modes) {
	let args = new Array(1);
	this.getArgs(args, modes);
	let promise = new Promise((resolve, reject) => {
	    this.rl.question('input: ', (input) => {
		console.log('got input', input);
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
