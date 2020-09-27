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

    console.log('best_asteroid:', best_asteroid, 'with', max_sightlines, 'sightlines');

    let outside_points = [];
    for (let x = best_asteroid.x; x <= max_x; x++)
	outside_points.push({x: x, y: 0});
    for (let y = 1; y <= max_y; y++)
	outside_points.push({x: max_x, y: y});
    for (let x = max_x; x >= 0; x--)
	outside_points.push({x: x, y: max_y});
    for (let y = max_y - 1; y >= 0; y--)
	outside_points.push({x: 0, y: y});
    for (let x = 1; x < best_asteroid.x; x++)
	outside_points.push({x: x, y: 0});
    
});


function hasSightline(p1, p2) {
    let p = firstOnSightline(p1, p2);
    return p.x === p2.x && p.y === p2.y;
}

// y = ((y2−y1)/(x2−x1))(x – x1) + y1
// m = (y2 - y1)/(x2-x1)
// y = mx - mx1 + y1
// b = -mx1 + y1
// y = mx + b
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
