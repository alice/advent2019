const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    crlfDelay: Infinity
});
const Computer = require('../intcode/computer.js');

const settings = [0, 1, 2, 3, 4];

rl.on('line', async (line) => {
    let program = line.split(',').map(x => parseInt(x));
    let signal = 0;

    let max = await trySettings(settings.slice(), program, [], signal);

    console.log('max: ', max);
    rl.close();
});

async function trySettings(settings, program, settings_permutation, signal) {
    let max = 0;
    for (let i = 0; i < settings.length; i++) {
	let setting = settings.splice(i, 1)[0];
	settings_permutation.push(setting);
	if (settings.length > 0) {
	    max = Math.max(max, await trySettings(settings.slice(), program,
						  settings_permutation, signal));
	} else {
	    console.log('running permutation: ' + settings_permutation);
	    let output = await runPermutation(program, settings_permutation, signal);
	    max = Math.max(max, output);
	    console.log('output: ' + output + '; max: ' + max);
	}
	settings_permutation.pop();
	settings.splice(i, 0, setting);
	return max;
    }
    return max;
}

async function runPermutation(program, settings_permutation, signal) {
    let computers = [];
    let next_name = 'A';

    for (setting of settings_permutation) {
	let computer = new Computer(program.slice(), [setting]);
	computer.name = next_name;
	next_name = String.fromCharCode(next_name.charCodeAt(0) + 1);
	console.log(computer.name + ' has setting ' + setting);
	if (computers.length > 0) {
	    let previous_computer = computers[0];
	    previous_computer.output_callback = (value) => {
		console.log('output_callback', value);
		computer.input(value);
	    };
	    console.log(previous_computer.name + ' output_callback is ' +
			computer.name + ' input');
	} else {
	    computer.input(signal);
	    console.log(computer.name + ' input is ' + signal);
	}
	computers.unshift(computer);
    }
    let output = null;
    computers[0].output_callback = (value) => { output = value; };
    console.log(computers[0].name + ' output_callback is ' +
		computers[0].output_callback.toString());
    computers.reverse();
    await Promise.all(computers.map((computer) => computer.run()));
    console.log('output is ' + output);
    return output;
}

