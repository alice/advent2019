const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class SpaceObject {
    constructor(name) {
	this.name = name;
	this.orbited_by = [];
	this.directly = null;
    }
    
    orbits(object) {
	this.directly = object;
	object.orbited_by.push(this);
    }
}

const all_objects = {};
rl.on('line', (line) => {
    if (line.length == 0) {
	let total_orbits = 0;
	for (let object of Object.values(all_objects)) {
	    let orbits = 0;
	    let directly = object.directly;
	    while (directly) {
		orbits++;
		directly = directly.directly;
	    }
	    total_orbits += orbits;
	}
	console.log('total orbits: ', total_orbits);

	let you = all_objects['YOU'].directly;
	let santa = all_objects['SAN'].directly;
	let you_ancestors = [];
	let santa_ancestors = [];
	let directly = you.directly;
	while (directly != null) {
	    you_ancestors.unshift(directly);
	    directly = directly.directly;
	}

	directly = santa.directly;
	while (directly != null) {
	    santa_ancestors.unshift(directly);
	    directly = directly.directly;
	}

	while (santa_ancestors[1] == you_ancestors[1]) {
	    common = santa_ancestors.shift();
	    you_ancestors.shift();
	}

	console.log('transfers required: ' + (santa_ancestors.length + you_ancestors.length));
	    
	rl.close();
	return;
    }
    
    let objects = line.split(')');
    let a = objects[0];
    if (!(a in all_objects))
	all_objects[a] = new SpaceObject(a);
    
    let b = objects[1];
    if (!(b in all_objects))
	all_objects[b] = new SpaceObject(b);

    all_objects[b].orbits(all_objects[a]);
});
