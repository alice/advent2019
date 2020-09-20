#!/usr/bin/env node

const yargs = require('yargs');
const argv = yargs
      .command('one')
      .argv;

if (argv._.includes('one')) {
    require('./one/one.js');
} else if (argv._.includes('two')) {
    require('./two/two.js');
} else if (argv._.includes('three')) {
    require('./three/three.js');
} else if (argv._.includes('four')) {
    require('./four/four.js');
} else if (argv._.includes('five')) {
    require('./five/five.js');
} else if (argv._.includes('six')) {
    require('./six/six.js');
} else if (argv._.includes('seven')) {
    require('./seven/seven.js');
} else if (argv._.includes('eight')) {
    require('./eight/eight.js');
} else {
    console.log('yargs: ' + JSON.stringify(argv));
    console.log('args: ' + JSON.stringify(process.argv));
}
