#!/usr/bin/env node
const program = require('commander')
const Togen = require('../lib/togen')


class Cmd {
  constructor() {
    program.version('0.1')

    this.togen = new Togen()
  }

  process(args) {
    this.init();
    this.console();
    this.configure();
    this.assemble();
    this.compile();
    this.deploy();

    if (!process.argv.slice(2).length) {
      program.help();
    }

    program.parse(args);
  }

  init() {
    program
      .command('init')
      .description('Initialize a togen directory')
      .action(() => {
        this.togen.init()
      })
  }

  console() {
    program
      .command('console')
      .description('Opens an interactive session to configure contract settings')
      .action(() => {
        this.togen.console('./')
      })
  }

  configure() {
    program
      .command('configure')
      .description('Configure contract parameters')
      .option('-i, --interactive', 'Opens interactive session to create contract configuration')
      .option('-f, --file [file]', 'Create configuration from a JSON file')
      .action((options) => {
        this.togen.configure({
          interactive: options.interactive,
          file: options.file
        })
      })
  }

  assemble() {
    program
      .command('Assemble contract templates')
      .option('-a, --all', 'Assembles all files in the current configuration directory')
      .option('-f, --file <file>', 'Assembles all files from a JSON configuration file')
      .option('-c, --contract <contract>', 'Assembles a single contract')
      .option('-o, --output <path>', 'Output path where the contract should be generated')
      .option('-p, --print', 'Prints the generated contracts')
      .action((options) => {
        this.togen.assemble({
          all: options.all,
          file: options.file,
          contract: options.contract,
          output: options.output
        })
      })
  }

  compile() {
    program
      .command('compile')
      .description('Compile one or several smart contracts')
      .option('-a, --all', 'Compiles all filese in the current configuration directory')
      .option('-f, --file [file]', 'Compiles all files from a JSON configuration file')
      .option('-c, --contract [contract]', 'Compiles a single contract as defined in the local settings directory')
      .option('-o, --output [path]', 'Output result file in a custom directory')
      .option('-b, --bytecode [path]', 'Output bytecode for a certain file')
      .option('-i, --interface [path]', 'Output ABI for a certain contract')
      .action((options) => {
        this.togen.compile({
        all: options.all,
        file: options.file,
        contract: options.contract,
        output: options.output
      })
    })
  }

  deploy() {
    program
      .command('deploy')
      .description('Deploy one or several smart contracts')
  }

}

module.exports = Cmd


