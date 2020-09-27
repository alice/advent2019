const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let asteroids = [];
let max_x = 0;
let max_y = 0;

rl.on('line', (line) => {
    let chars = line.split('');

    if (max_x === 0)
	max_x = chars.length - 1;

    for (const [index, char] of chars.entries()) {
	if (char === '#')
	    asteroids.push({x: index, y: max_y});
    }
    max_y++;
});


rl.on('close', () => {
    max_y--;

    let max_sightlines = 0;
    let best_asteroid = null;
    for (const [index1, p1] of asteroids.entries()) {
	let sightlines = 0;
	for (const [index2, p2] of asteroids.entries()) {
	    if (index1 === index2)
		continue;
	    if (hasSightline(p1, p2))
		sightlines++;
	}
	if (sightlines > max_sightlines) {
	    max_sightlines = sightlines;
	    best_asteroid = p1;
	}
    }

    console.log('best is', best_asteroid, max_sightlines);

    console.log('straight up is', computeAngle(best_asteroid, {x: best_asteroid.x, y: 0}));
    console.log('top right is', computeAngle(best_asteroid, {x: max_x, y: 0}));
    console.log('straight right is', computeAngle(best_asteroid, {x: max_x, y: best_asteroid.y}));
    console.log('bottom right is', computeAngle(best_asteroid, {x: max_x, y: max_y}));
    console.log('straight down is', computeAngle(best_asteroid, {x: best_asteroid.x, y: max_y}));
    console.log('bottom left is', computeAngle(best_asteroid, {x: 0, y: max_y}));
    console.log('straight left is', computeAngle(best_asteroid, {x: 0, y: best_asteroid.y}));
    console.log('top left is', computeAngle(best_asteroid, {x: 0, y: 0}));
    

    let vaporized = 0;
    while (asteroids.length > 1) {
	let asteroid_angles = [];
	for (const asteroid of asteroids) {
	    if (asteroid === best_asteroid)
		continue;
	    const angle = computeAngle(best_asteroid, asteroid)
	    asteroid_angles.push({angle, asteroid});
	}
	asteroid_angles.sort((a1, a2) => { return a1.angle - a2.angle; });

	let prev_angle = -1;
	for (let [i, {angle, asteroid}] of asteroid_angles.entries()) {
	    if (angle === prev_angle)
		continue;

	    target = firstOnSightline(best_asteroid, asteroid);
	    asteroids.splice(asteroids.indexOf(target), 1);
	    vaporized++;
	    if (vaporized % 10 === 0)
		console.log(vaporized, 'vaporized', angle.toPrecision(4),  asteroid);
	    prev_angle = angle;
	}
    }
});

function hasSightline(p1, p2) {
    let p = firstOnSightline(p1, p2);
    return p.x === p2.x && p.y === p2.y;
}

function firstOnSightline(p1, p2) {
    if (p1.x === p2.x) {
	let x = p1.x;

	let delta_y = p2.y - p1.y;
	let sign = Math.sign(delta_y);
	for (let i = 1; i <= Math.abs(delta_y); i++) {
	    let y = p1.y + (sign * i);
 	    const p = find(x, y);
	    if (p)
		return p;
	}
	return null;
    }
    
    const m = (p2.y - p1.y) / (p2.x - p1.x);
    const b = (-m * p1.x) + p1.y;
    console.assert(p2.y == adjust(m*p2.x + b), adjust(m*p2.x + b));

    let delta_x = p2.x - p1.x;
    let sign = Math.sign(delta_x);
    for (let i = 1; i <= Math.abs(delta_x); i++) {
	let x = p1.x + (sign * i);
	let y = adjust(m*x + b);
	if (!Number.isInteger(y) || y < 0 || y > max_y)
	    continue;
	
	const p = find(x, y);
	if (p)
	    return p;
    }
    return null
}

function adjust(n) {
    return Math.round(n * 10e3) / 10e3;
}

function find(x, y) {
    return asteroids.find(({x: px, y: py}) => {
	return px === x && py === y;
    });
}

function computeAngle(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    const angleFromXAxis = Math.atan2(dy, dx) * 180/Math.PI;
    let angleFromYAxis = angleFromXAxis + 90;
    if (angleFromYAxis < 0)
	angleFromYAxis += 360;
    return angleFromYAxis;
}
