const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let totalFuel = 0;
rl.on('line', (line) => {
    // parse line as number
    let mass = parseInt(line);
    if (isNaN(mass)) {
	console.log('total fuel for modules: ', totalFuel);

	rl.close();
	return;
    }
    let fuelMass = calculateFuel(mass);
    totalFuel += fuelMass;

    let fuelForFuel = 0;
    while (fuelMass > 0) {
	fuelMass = calculateFuel(fuelMass);
	if (fuelMass > 0)
	    fuelForFuel += fuelMass;
    }
    totalFuel += fuelForFuel;
});

function calculateFuel(mass) {
    return Math.floor(mass / 3) - 2;
}


