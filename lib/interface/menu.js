const command = require('inquirer');
const Table = require('cli-table2');
const clear = require('clear');
const until = require('catchify')


require('../utils');
const questions = require('../questions');
const assembler = require('../assembler/index.js');

command.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const Options = require('../options/index.js');
const Config = require('../config/index.js')
const Compiler = require('../compiler.js');
const Display = require('../display.js');

const Router = require('./router')

const AppError = require('../errors/AppError')

const display = new Display();
const config = new Config();

class Interface {

  constructor(settings) {
    this.settings = settings || new Options({})
    this.compiler = new Compiler(config.contracts.artifacts)
    this.router = new Router({mainMenu: this})
  }

  async open({settings}) {
    this.settings = settings || new Options({})
    await this.showMainMenu();
  }

  async showMainMenu() {
    display.message.mainMenu();
    const { choice } = await command.prompt(questions.categories);

    if (choice === 'Configure Contracts') {
      await this.router.openSettingsMenu({settings: this.settings})

    } else if (choice === 'Display Contract Configuration') {
      display.showConfiguration(this.settings);
      await display.waitUntilKeyPress();
      await this.showMainMenu();

    } else if (choice === 'Build Contracts') {
      let contracts = Options.getLocalContracts()
      let settings = Options.parseLocalSettings()

      if (!settings) {
        throw new AppError('CONFIG_ERROR', 'Could not parse settings')
        display.spinner.fail("Configuration could not be loaded")
      } else {
        display.spinner.succeed("Configuration loaded")
      }

      display.spinner.start("Assembling contracts")
      var [error] = await until(assembler.buildContracts(settings, contracts, {print: false, output: false}))
      if (error) {
        display.spinner.fail("Contracts could not be assembled")
        console.log(error)
      } else {
        display.spinner.succeed("Contracts assembled")
      }

    } else if (choice === 'Compile Contracts') {
      await this.router.openCompilerMenu({settings: this.settings});

    } else if (choice === 'Configure Account') {
      await this.router.openAccountMenu({settings: this.settings});

    } else if (choice === 'Deploy Contracts') {
      await this.router.openDeployerMenu({settings: this.settings})

    } else if (choice === 'Close') {
      process.exit();

    } else if (choice === 'Help') {
      display.help();
    }
  }


  // async showContractMenu({ additionalFields = [] }) {
  //   const optionsList = this.settings.getIncludedContracts().uncamelize();
  //   additionalFields.forEach((field) => { optionsList.push(field); });
  //   const menu = questions.contractOptionsList(optionsList);
  //   const { choice } = await command.prompt(menu);
  //   return choice;
  // }

  // async saveSettings() {
  //   try {
  //     this.settings.save();
  //     display.message.configurationSaved();
  //     await display.waitUntilKeyPress();
  //   }
  //   catch(e) {
  //     if (e instanceof Error) {
  //       display.message.configurationNotSaved(e);
  //       await display.waitUntilKeyPress();
  //     }
  //   }
  // }


  // async loadSettings() {
  //   try {
  //     this.settings.load();
  //     display.message.configurationLoaded();
  //     await display.waitUntilKeyPress();
  //   }
  //   catch(e) {
  //     if (e instanceof Error) {
  //       display.message.configurationNotLoaded();
  //       await display.waitUntilKeyPress();
  //     }
  //   }
  // }

}

module.exports = Interface