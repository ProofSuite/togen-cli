#!/usr/bin/env node

var program = require('commander')
var interactive = require('../interactive.js').start

program
    .command('console')
    .description('Open an interactive session to create contracts')
    .action(function() {
      interactive()
    })

program
    .command('configure')
    .description('Configure')
    .option('-i, --interactive', 'Opens interactive configuration console')
    .option('-f, --file <file>', 'Create configuration from a JSON file')
    .actions(function(options) {


    })

program
    .command('assemble')
    .description('Assemble')
    .option('-a, --all', 'Assembles all files in the current configuration directory')
    .option('-f, --file <file>', 'Assembles all files from a JSON configuration file')
    .option('-c, --contract <contract>', 'Assembles a single contract')
    .option('-o, --output <path>', 'Output path where the contract should be generated')
    .actions(function() {

    })

program
    .command('compile [file]')
    .description('Compile one or several smart contracts')
    .option('-a, --all', 'Compiles all files in the current configuration directory')
    .option('-f, --file <file>', '')
    .option('-c, --contract <contract>', 'Compiles a single contract')
    .option('-o, --output <path>', 'Output path where the contract should be generated')
    .actions(function() {

    })

program
    .command('deploy [file]')
    .actions(function() {

    })




// program
//     .command('')
//     .option('--interactive')
//     .option('--configuration')
//     .option('--comile')
//     .parse(process.argv)

// if (program.interactive) {
//   interactive()
// }