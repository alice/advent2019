const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let moons = [];
let moon_names = ["Io", "Europa", "Ganymede", "Callisto"];

rl.on('line', (line) => {
    console.assert(moon_names.length > 0);
    moons.push(new Moon(line, moon_names.shift()));
});

rl.on('close', () => {
    for (let i = 1; i <= 1000; i++) {
	for (let moon of moons)
	    moon.updateVelocity(moons);
	for (let moon of moons)
	    moon.updatePosition();
    }

    console.log('total energy: ', computeEnergy(moons));
});

function computeEnergy(moons) {
    return moons.reduce((totalEnergy, moon) => totalEnergy + moon.computeEnergy(), 0);
}

function logMoons(steps) {
    console.log(`After ${steps} steps:`);
    for (const moon of moons)
	console.log(moon.toString());    
}

function formatVector(vector) {
    with (vector)
	return `<x=${x}, y=${y}, z=${z}>`;
}

const moon_re = /<x=(?<x>-?\d+), y=(?<y>-?\d+), z=(?<z>-?\d+)>/
class Moon {
    constructor(data, name) {
	const matches = data.match(moon_re);
	console.assert(matches);

	let x = Number.parseInt(matches.groups['x']);
	let y = Number.parseInt(matches.groups['y']);
	let z = Number.parseInt(matches.groups['z']);
	this.position = {x, y, z};

	this.velocity = {x: 0, y: 0, z: 0};

	this.name = name;
    }

    updateVelocity(moons) {
	for (const moon of moons) {
	    if (moon.name === this.name)
		continue;
	    for (const axis in this.position) {
		if (moon.position[axis] < this.position[axis])
		    this.velocity[axis] -= 1;
		else if (moon.position[axis] > this.position[axis])
		    this.velocity[axis] += 1;
	    }
	}
    }

    updatePosition() {
	for (const axis in this.velocity)
	    this.position[axis] += this.velocity[axis];
    }

    computeEnergy() {
	let potential = 0;
	for (const axis in this.position)
	    potential += Math.abs(this.position[axis]);

	let kinetic = 0;
	for (const axis in this.velocity)
	    kinetic += Math.abs(this.velocity[axis]);

	return potential * kinetic;
    }

    toString() {
	return `pos=${formatVector(this.position)}, ` +
	    `vel=${formatVector(this.velocity)} ` +
	    `(${this.name})`;
    }
}
