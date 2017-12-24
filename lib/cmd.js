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
    this.help();
    this.unknown();

    if (!process.argv.slice(2).length) program.help()
    program.parse(args);
  }

  init() {
    program
      .command('init')
      .description('Initialize a togen directory')
      .option('-n, --name [name]', 'Create a togen configuration folder')
      .action((options) => {
        this.togen.init({
          name: options.name
        })
      })
  }

  console() {
    program
      .command('console')
      .description('Opens an interactive session to configure contract settings')
      .action(() => {
        this.togen.interactive()
      })
  }

  configure() {
    program
      .command('configure')
      .description('Configure contract parameters')
      .option('-s, --show', 'Show current configuration')
      .option('-e, --edit', 'Edit current configuration')
      .option('-i, --interactive', 'Opens interactive session to create contract configuration')
      .option('-f, --file [file]', 'Create configuration from a JSON file')
      .option('-a, --account [account]', 'Edit account configuration')
      .option('-d, --default', 'Create default configuration')
      .action((options) => {
        this.togen.configure({
          interactive: options.interactive,
          file: options.file,
          default: options.default,
          show: options.show,
          edit: options.edit,
          account: options.account
        })
      })
  }

  assemble() {
    program
      .command('assemble')
      .description("Assemble contract templates")
      .option('-f, --file [file]', 'Assembles all files from a JSON configuration file')
      .option('-c, --contracts [contracts]', 'Assembles a single contract')
      .option('-o, --output [path]', 'Output path where the contract should be generated')
      .option('-p, --print', 'Prints the generated contracts')
      .action((options) => {
        this.togen.assemble({
          file: options.file,
          contracts: options.contracts,
          output: options.output,
          print: options.print
        })
      })
  }

  compile() {
    program
      .command('compile')
      .description('Compile one or several smart contracts')
      .option('-f, --file [file]', 'Compiles all files from a JSON configuration file')
      .option('-c, --contract [contract]', 'Compiles a single contract as defined in the local settings directory')
      .option('-o, --output [path]', 'Output result file in a custom directory')
      .option('-b, --bytecode', 'Output bytecode for a certain file')
      .option('-i, --interface', 'Output ABI for a certain contract')
      .action((options) => {
         this.togen.compile({
          file: options.file,
          contract: options.contract,
          output: options.output,
          bytecode: options.bytecode,
          interface: options.interface
        })
    })
  }

  deploy() {
    program
      .command('deploy')
      .description('Deploy one or several smart contracts')
      .action((options) => {
        this.togen.deploy({
          contracts: options.contract
        })
      })
  }

  help() {
    program
      .command('help')
      .action(function() {
        console.log('\n\n')
        console.log('Usage: togen [command] [options]\n\n')
        console.log('Options:\n')
        console.log(' -h, --help   output usage information')
        console.log(' -V, --version  output version number\n\n')
        console.log('Commands:\n')
        console.log(' init [--name]\n')
        console.log('   Initialize a togen directory')
        console.log('   --name: Enter togen folder name (optional)\n\n')
        console.log(' console\n')
        console.log('   Opens an interactive session to configure contract settings\n\n')
        console.log(' configure [--show |--edit|--interactive] [--file <file> | --default]\n')
        console.log('   Configure contract parameters')
        console.log('   --show: Show configuration (from current project, file or default configuration)')
        console.log('   --edit: Edit configuration. If the file option is used, the file configuration will replace the project configuration')
        console.log('   --interactive: Edit configuration interactively\n\n')
        console.log(' assemble [--file <file>] [--contracts <contract-names>] [--output <path] [--print]\n')
        console.log('   Assemble contract templates')
        console.log('   --file: Assemble contract from file configuration (if the file is not provided, the configuration will be current project configuration)')
        console.log('   --contracts: Only assemble the provided contracts (the settings file is still required)')
        console.log('   --output: Outputs the resulting solidity code to the given path\n\n')
        console.log(' compile [--file <file>] [--contract <contract-names>] [--output <path>] [--bytecode | --interface]\n')
        console.log('   Compile one or several smart contracts')
        console.log('   --file: Compiles contract from file configuration (if the file is not provided, the configuration will be the current project configuration)')
        console.log('   --contracts: Only compiles the provided contracts (the settings file is still required)')
        console.log('   --output: Outputs the resulting compile information to the given path')
        console.log('   --bytecode: Print contracts bytecode')
        console.log('   --interface: Print contracts interface\n\n')
      })
  }

  unknown() {
    program
      .action(function(env) {
        console.log(`Unknown command ${env}`)
        console.log("type togen --help to see the available commands")
        process.exit(0)
      })
  }



}

module.exports = Cmd


