const fs = require('fs');

class Image {
    constructor(data, width, height) {
	this.width = width;
	this.height = height;

	this.layers = [];
	this.initialiseLayers(data);
    }

    initialiseLayers(data) {
	while (data.length > 0) {
	    let layer = [];
	    for (let r = 0; r < this.height; r++) {
		let row = [];
		for (let c = 0; c < this.width; c++)
		    row.push(data.shift());
		layer.push(row);
		console.log('row', row);
	    }
	    this.layers.push(layer);
	}
	this.layers.reverse();
    }

    render() {
	let result = [];
	for (let r = 0; r < this.height; r++) {
	    result[r] = [];
	    for (let c = 0; c < this.width; c++) {
		let color = 1;
		for (let layer of this.layers) {
		    switch(layer[r][c]) {
		    case 0:
			color = 0;
			break;
		    case 1:
			color = 1;
			break;
		    case 2:
			// transparent
			break;
		    }
		}
		result[r][c] = color;
	    }
	}
	return result;
    }
}

let line = fs.readFileSync('eight/input.txt', 'utf8');
console.log('line', line);
parse(line);

function parse(line) {
    let data = line.split('').map(x => parseInt(x));
    let last = data.pop();
    while (isNaN(last))
	last = data.pop();
    data.push(last);
    let image = new Image(data, 25, 6);
    let result = image.render();
    for (let row of result) {
	console.log(row.map((x) => { return x === 0 ? ' ' : '*'}).join(''));
    }
}

function check(image) {
    let min_zeroes = Number.MAX_VALUE;
    let ones = 0;
    let twos = 0;
    for (const [i, layer] of image.layers.entries()) {
	let counts = [0, 0, 0];;
	for (let row of layer) {
	    for (let x of row) {
		counts[x]++;
	    }
	}
	if (counts[0] < min_zeroes) {
	    min_zeroes = counts[0];
	    ones = counts[1];
	    twos = counts[2];
	}
    }
    console.log('result:', ones * twos);
}
