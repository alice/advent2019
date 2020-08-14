#!/usr/bin/env node

const yargs = require('yargs');
const argv = yargs
      .command('one')
      .argv;

if (argv._.includes('one')) {
    const one = require('./one/one.js');
} else {
    console.log('yargs: ' + JSON.stringify(argv));
    console.log('args: ' + JSON.stringify(process.argv));
}
