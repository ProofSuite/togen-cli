require('../utils');

const command = require('inquirer');
const until = require('catchify')
const questions = require('../questions');
const _ = require('underscore')

command.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const Options = require('../options/index.js');
const Config = require('../config/index.js')
const Compiler = require('../compiler.js');
const Display = require('../display.js');

const display = new Display();
const config = new Config();

class CompilerMenu {

  constructor({router, settings}) {
    this.router = router
    this.compiler = new Compiler(config.contracts.artifacts)
    this.settings = settings || new Options({})
  }

  async open() {
    await this.showCompilerMenu();
  }

  async showCompilerMenu() {
    let menu = questions.compilerMenu({additionalFields: ['Back', 'Close']})
    const { choice } = await command.prompt(menu);

    if (choice === 'Compile All Contracts') {
      await this.compileAllContracts()
    } else if (choice === 'Compile Contract') {
      await this.compileContract()
    }
    else if (choice === 'Back') {
      await this.router.openMainMenu({settings: this.settings})
    }
  }

  async compileAllContracts() {
    const contracts = Options.getLocalContracts()
    const params = {bytecode: false, abi: false, output: false}

    var [error, result] = await until(this.compiler.compileContracts(contracts, params))
    error ? console.log(error) : display.compileSuccess()

    await display.waitUntilKeyPress()
    await this.router.openMainMenu({settings: this.settings})
  }


  async compileContract() {
    const choice = await this.showContractMenu({ additionalFields: []});
    const params = {bytecode: false, abi: false, output: false}

    var [error, result] = await until(this.compiler.compileContracts([choice], params))
    error ? console.log(error) : display.compileSuccess()

    await display.waitUntilKeyPress()
    await this.router.openMainMenu({settings: this.settings})
  }

  async showContractMenu({ additionalFields = [] }) {
    let optionsList = this.settings.getIncludedContracts().uncamelize();
    optionsList = optionsList.concat(additionalFields)
    const menu = questions.contractOptionsList(optionsList);
    const { choice } = await command.prompt(menu);
    return choice;
  }

}

module.exports = CompilerMenu
