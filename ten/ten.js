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

    console.log('asteroids', asteroids, 'max_x', max_x, 'max_y', max_y);
    let max_sightlines = 0;
    let best_asteroid = null;
    for (const [index1, p1] of asteroids.entries()) {
	let sightlines = 0;
	for (const [index2, p2] of asteroids.entries()) {
	    if (index1 === index2)
		continue;
	    if (hasSightLine(p1, p2))
		sightlines++;
	}
	if (sightlines > max_sightlines) {
	    console.log(p1, 'has most sightlines so far:', sightlines, 'vs', max_sightlines);
	    max_sightlines = sightlines;
	    best_asteroid = p1;
	}
    }

    console.log('best_asteroid:', best_asteroid);
});




// y = ((y2−y1)/(x2−x1))(x – x1) + y1
// m = (y2 - y1)/(x2-x1)
// y = mx - mx1 + y1
// b = -mx1 + y1
// y = mx + b
function hasSightLine(p1, p2) {
    if (p1.x === p2.x) {
	let x = p1.x;
	for (let y = p1.y - 1; y >= 0; y--) {
	    if (y === p2.y) 
		return true;
		
	    const p = find(x, y);
	    if (p)
		return false;
	}

	for (let y = p1.y + 1; y <= max_y; y++) {
	    if (y === p2.y) 
		return true;
		
	    const p = find(x, y);
	    if (p)
		return false;
	}
	throw ('didn\'t find', p2);
    }
    
    const m = (p2.y - p1.y) / (p2.x - p1.x);
    const b = (-m * p1.x) + p1.y;
    console.assert(p2.y == adjust(m*p2.x + b), adjust(m*p2.x + b));

    for (let x = p1.x - 1; x >= 0; x--) {
	y = adjust(m*x + b);
	if (!Number.isInteger(y))
	    continue;

	if (x === p2.x && y === p2.y)
	    return true;

	const p = find(x, y);
	if (p)
	    return false;
    }

    for (let x = p1.x + 1; x <= max_x; x++) {
	y = adjust(m*x + b);
	if (!Number.isInteger(y))
	    continue;

	if (x === p2.x && y === p2.y)
	    return true;
	    
	const p = find(x, y);
	if (p)
	    return false;
    }

    console.log('coding error: did not find', p2, 'from', p1);
    throw('');
}

function adjust(n) {
    return Math.round(n * 10e6) / 10e6;
}

function find(x, y) {
    return asteroids.find(({x: px, y: py}) => {
	return px === x && py === y;
    });
}
