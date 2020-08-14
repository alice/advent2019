const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function trace(instructions, grid, wire) {
    let coords = { x: 0, y: 0 };
    let intersections = [];
    const re = /(?<direction>[UDLR])(?<distance>\d+)/;
    for (let instruction of instructions) {
	let match = instruction.match(re);
	let direction = match.groups.direction;
	let distance = match.groups.distance;
	switch (direction) {
	case 'U': {
	    grid.moveUpBy(coords, distance, wire, intersections);
	    break;
	}
	case 'D': {
	    grid.moveDownBy(coords, distance, wire, intersections);
	    break;
	}
	case 'L': {
	    grid.moveLeftBy(coords, distance, wire, intersections);
	    break;
	}
	case 'R': {
	    grid.moveRightBy(coords, distance, wire, intersections);
	    break;

	}
	default:
	    throw 'Bad direction: ' + direction;
	}
//	console.log('coords after', instruction, coords);
    }
//    grid.print();
    return intersections;
}

class Grid {
    constructor() {
	this.data = {};
    }

    print() {
	console.log(JSON.stringify(this.data));
    }

    get(x, y) {
	if (!this.data.hasOwnProperty(y))
	    return undefined;
	return this.data[y][x];
    }

    set(x, y, val) {
	if (!this.data.hasOwnProperty(y))
	    this.data[y] = {};
	this.data[y][x] = val;
    }

    mark(coords, wire, intersections) {
	if (this.get(coords.x, coords.y) != undefined && this.get(coords.x, coords.y) != wire) {
	    intersections.push({...coords});
	}
	this.set(coords.x, coords.y, wire);
    }

    moveLeftBy(coords, distance, wire, intersections) {
	for (let dx = 0; dx < distance; dx++) {
	    coords.x -= 1;
	    this.mark(coords, wire, intersections);
	}
    }

    moveRightBy(coords, distance, wire, intersections) {
	for (let dx = 0; dx < distance; dx++) {
	    coords.x += 1;
	    this.mark(coords, wire, intersections);
	}
    }

    moveUpBy(coords, distance, wire, intersections) {
	for (let dy = 0; dy < distance; dy++) {
	    coords.y += 1;
	    this.mark(coords, wire, intersections);
	}
    }

    moveDownBy(coords, distance, wire, intersections) {
	for (let dy = 0; dy < distance; dy++) {
	    coords.y -= 1;
	    this.mark(coords, wire, intersections);
	}
    }

}

let grid = new Grid();
let wire = 1;
rl.on('line', (line) => {
    if (line == "") {
	rl.close();
	return;
    }
    let instructions = line.split(',');
    let intersections = trace(instructions, grid, wire);
    wire++;
    console.log('intersections: ', intersections, intersections.map(coords => Math.abs(coords.x) + Math.abs(coords.y)).sort());
});
