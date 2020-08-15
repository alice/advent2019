const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function trace(instructions, grid, wire) {
    let coords = { x: 0, y: 0 };
    const re = /(?<direction>[UDLR])(?<distance>\d+)/;
    for (let instruction of instructions) {
	let match = instruction.match(re);
	let direction = match.groups.direction;
	let distance = match.groups.distance;
	switch (direction) {
	case 'U': {
	    grid.moveUpBy(coords, distance, wire);
	    break;
	}
	case 'D': {
	    grid.moveDownBy(coords, distance, wire);
	    break;
	}
	case 'L': {
	    grid.moveLeftBy(coords, distance, wire);
	    break;
	}
	case 'R': {
	    grid.moveRightBy(coords, distance, wire);
	    break;

	}
	default:
	    throw 'Bad direction: ' + direction;
	}
    }
}

class Grid {
    constructor() {
	this.data = {};
    }

    print() {
	console.log(JSON.stringify(this.data));
    }

    get({x, y}) {
	if (!this.data.hasOwnProperty(y))
	    return undefined;
	return this.data[y][x];
    }

    set({x, y}, wire) {
	if (!this.data.hasOwnProperty(y))
	    this.data[y] = {};
	if (!this.data[y].hasOwnProperty(x))
	    this.data[y][x] = [];
	let totalLength = wire.totalLength;
	this.data[y][x].push({totalLength, wire});
    }

    mark(coords, wire) {
	let existing = this.get(coords);
	if (existing) {
	    for (let data of existing) {
		if (data.wire === wire)
		    continue;
		let totalLength = wire.totalLength;
		let intersection = {...coords};
		wire.intersections.set(intersection, totalLength);
		data.wire.intersections.set(intersection, data.totalLength);
	    }
	}
	this.set(coords, wire);
    }

    moveLeftBy(coords, distance, wire) {
	for (let dx = 0; dx < distance; dx++) {
	    coords.x -= 1;
	    wire.totalLength += 1;
	    this.mark(coords, wire);
	}
    }

    moveRightBy(coords, distance, wire) {
	for (let dx = 0; dx < distance; dx++) {
	    coords.x += 1;
	    wire.totalLength += 1;
	    this.mark(coords, wire);
	}
    }

    moveUpBy(coords, distance, wire) {
	for (let dy = 0; dy < distance; dy++) {
	    coords.y += 1;
	    wire.totalLength += 1;
	    this.mark(coords, wire);
	}
    }

    moveDownBy(coords, distance, wire) {
	for (let dy = 0; dy < distance; dy++) {
	    coords.y -= 1;
	    wire.totalLength += 1;
	    this.mark(coords, wire);
	}
    }

}

class Wire {
    constructor(id) {
	this.id = id;
	this.totalLength = 0;
	this.intersections = new Map();
    }
}

let grid = new Grid();
let wireId = 1;
let wires = [];
rl.on('line', (line) => {
    if (line == "") {
	rl.close();
	return;
    }
    let wire = new Wire(wireId++);
    wires.push(wire);
    let instructions = line.split(',');
    trace(instructions, grid, wire);
    console.log('wire', JSON.stringify(wire));
    console.log('manhattan distances', [...wire.intersections.entries()].map(
	([coords, totalLength]) =>
	    Math.abs(coords.x) + Math.abs(coords.y)).sort());
    if (wires.length > 1) {
	let intersections = new Map();
	for (let wire of wires) {
	    for (let coords of wire.intersections.keys()) {
		if (intersections.has(coords)) {
		    intersections.set(coords,
				      intersections.get(coords) + wire.intersections.get(coords));
		} else {
		    intersections.set(coords, wire.intersections.get(coords));
		}
	    }
	}
	console.log('wire distances', JSON.stringify([...intersections.values()].sort()));
    }
});
