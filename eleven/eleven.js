const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});
const Computer = require('../intcode/computer.js');

rl.on('line', async(line) => {
        let program = line.split(',').map((x) => {
	let n = BigInt(x);
	if (n <= BigInt(Number.MAX_SAFE_INTEGER))
	    return Number(n);
	return n;
    });
    let signal = 0;
    let computer = new Computer(program);
    let robot = new Robot();
    computer.output_callback = (input) => {
	robot.instruction(input);
    };
    computer.input_promise = () => {
	let promise = new Promise((resolve, reject) => {
	    resolve(robot.camera());
	});
	return promise;
    };
    await computer.run();
    console.log(robot.painted.size, 'painted');
    robot.print();
});
      
const PAINT = 0;
const TURN = 1;
const NUM_OPS = 2;

const BLACK = 0;
const WHITE = 1;

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;
const NUM_DIRECTIONS = 4;

const TURN_LEFT = 0;
const TURN_RIGHT = 1;


class Robot {
    constructor() {
	this.location = {x: 0, y: 0};
	this.direction = UP;
	this.next_op = PAINT;
	this.painted_white = new Set();
	this.painted_white.add(JSON.stringify(this.location));
	this.painted = new Set(this.painted_white);
	this.top_left = {x: 0, y: 0};
	this.bottom_right = {x: 0, y: 0};
    }

    instruction(input) {
	switch (this.next_op) {
	case PAINT:
	    this.paint(input);
	    break;
	case TURN:
	    this.turn(input);
	    break;
	}
	this.next_op = (this.next_op + 1) % NUM_OPS;
    }

    camera() {
	if (this.painted_white.has(JSON.stringify(this.location)))
	    return WHITE;
	return BLACK;
    }

    paint(input) {
	switch (input) {
	case WHITE:
	    this.painted_white.add(JSON.stringify(this.location));
	    break;
	case BLACK:
	default:
	    this.painted_white.delete(JSON.stringify(this.location));
	    break;
	}

	this.painted.add(JSON.stringify(this.location));
    }

    turn(input) {
	switch (input) {
	case TURN_LEFT:
	    this.direction = (this.direction - 1 + NUM_DIRECTIONS) % NUM_DIRECTIONS;
	    break;
	case TURN_RIGHT:
	default:
	    this.direction = (this.direction + 1) % NUM_DIRECTIONS;
	    break;
	}

	switch (this.direction) {
	case UP:
	    this.location.y -= 1;
	    break;
	case RIGHT:
	    this.location.x += 1;
	    break;
	case DOWN:
	    this.location.y += 1;
	    break;
	case LEFT:
	default:
	    this.location.x -= 1;
	    break;
	}

	if (this.location.x < this.top_left.x)
	    this.top_left.x = this.location.x;
	if (this.location.y < this.top_left.y)
	    this.top_left.y = this.location.y;
	if (this.location.x > this.bottom_right.x)
	    this.bottom_right.x = this.location.x;
	if (this.location.y > this.bottom_right.y)
	    this.bottom_right.y = this.location.y;
    }

    print() {
	for (let y = this.top_left.y; y <= this.bottom_right.y; y++) {
	    let row = '';
	    for (let x = this.top_left.x; x <= this.bottom_right.x; x++) {
		const point = {x, y};
		if (this.painted_white.has(JSON.stringify(point)))
		    row += '#';
		else
		    row += ' ';
	    }
	    console.log(row);
	}
    }
}

