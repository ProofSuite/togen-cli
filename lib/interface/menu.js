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

const AccountMenu = require('./account_menu')
const Router = require('./router')

const AppError = require('../errors/AppError')

const display = new Display();
const config = new Config();
const router = new Router();

class Interface {

  constructor(settings) {
    this.settings = settings || new Options({})
    this.compiler = new Compiler(config.contracts.artifacts)
    this.accountMenu = new AccountMenu()
  }

  async open() {
    await this.showMainMenu();
  }

  async showMainMenu() {
    display.message.mainMenu();
    const { choice } = await command.prompt(questions.categories);

    if (choice === 'Configure Contracts') {
      await this.showConfigurationMenu();

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
      await this.showCompilerMenu();

    } else if (choice === 'Configure Account') {
      await router.openAccountMenu()

    } else if (choice === 'Close') {
      process.exit();

    } else if (choice === 'Help') {
      display.help();
    }
  }

  async showConfigurationMenu() {
    display.message.configurationMenu();
    const options = await command.prompt(questions.configurationMenu);

    if (options.choice === 'Edit Configuration') {
      await this.showContractSelectionMenu();

    } else if (options.choice === 'Display Current Configuration') {
      display.showConfiguration(this.settings);
      await display.waitUntilKeyPress();

    } else if (options.choice === 'Save Configuration') {
      await this.saveSettings()

    } else if (options.choice === 'Load Previous Configuration') {
      await this.loadSettings()

    } else if (options.choice === 'Back') {
      await this.showMainMenu();

    }

    await this.showConfigurationMenu();
  }



  // TODO replace the hardcoded list of contracts by parsing the files in the templates folder
  async showContractSelectionMenu() {
    display.message.contractSelectionMenu();
    const contractFiles = ['Presale', 'Presale Token', 'Token', 'Token Sale', 'Wallet'];
    const contracts = questions.contractCheckboxList(contractFiles);
    const { choice } = await command.prompt(contracts);
    this.settings.setIncludedContracts(choice);
    await this.showContractConfigurationMenu();
  }

  async showContractConfigurationMenu() {
    display.message.contractConfigurationMenu();
    const additionalFields = ['Display Contract Configuration', 'Additional Options', 'Go to main menu'];
    const choice = await this.showContractMenu({ additionalFields: additionalFields });

    if (choice === 'Presale Token') {
      await this.showPresaleTokenMenu();

    } else if (choice === 'Presale') {
      await this.showPresaleMenu();

    } else if (choice === 'Token') {
      await this.showTokenMenu();

    } else if (choice === 'TokenSale') {
      await this.showTokenSaleMenu();

    } else if (choice === 'Wallet') {
      await this.showWalletMenu();

    } else if (choice === 'Display Contract Configuration') {
      display.showConfiguration(this.settings);
      await display.waitUntilKeyPress();
      await this.showContractConfigurationMenu();

    } else if (choice === 'Advanced Options') {
      await this.requestAdvancedOptions();

    } else if (choice === 'Back') {
      await this.showConfigurationMenu();
    }
  }

  async showPresaleTokenMenu() {
    display.message.paramsRequest('Token');
    const { choice } = await command.prompt(questions.tokenMenu);

    if (choice === 'Base Configuration') {
      display.message.paramsRequest('Presale Token');
      await this.settings.presaleToken.updateBasicOptions();
      await this.showPresaleTokenMenu();

    } else if (choice === 'Token Type') {
      display.message.paramsRequest('Token Type');
      await this.settings.presaleToken.updateTokenStandard();
      await this.showPresaleTokenMenu();

    } else if (choice === 'Advanced Configuration') {
      await this.settings.presaleToken.updateAdvancedOptions();
      await this.showPresaleTokenMenu();

    } else if (choice === 'Display Current Configuration') {
      display.showConfiguration(this.settings);
      await display.waitUntilKeyPress();
      await this.showPresaleTokenMenu();

    } else if (choice === 'Back') {
      await this.showContractConfigurationMenu();
    }
  }

  async showWalletMenu() {
    display.message.paramsRequest('Wallet');
    const { choice } = await command.prompt(questions.walletMenu);

    if (choice === 'Wallet Type') {
      await this.settings.wallet.updateType();
      await this.showWalletMenu();

    } else if (choice == 'Display Current Configuration') {
      display.showConfiguration(this.settings);
      await display.waitUntilKeyPress();
      await this.showWalletMenu();

    } else if (choice === 'Back') {
      await this.showContractConfigurationMenu();
    }
  }

  async showTokenMenu() {
    display.message.paramsRequest('Token');
    const { choice } = await command.prompt(questions.tokenMenu);

    if (choice === 'Base Configuration') {
      display.message.paramsRequest('Token');
      await this.settings.token.updateBasicOptions();
      await this.showTokenMenu();

    } else if (choice === 'Token Type') {
      display.message.paramsRequest('Token Type');
      await this.settings.token.updateTokenStandard();
      await this.showTokenMenu();

    } else if (choice === 'Advanced Configuration') {
      await this.settings.token.updateAdvancedOptions();
      await this.showTokenMenu();

    } else if (choice === 'Display Current Configuration') {
      display.showConfiguration(this.settings);
      await display.waitUntilKeyPress();
      await this.showTokenMenu();

    } else if (choice === 'Back') {
      await this.showContractConfigurationMenu();
    }
  }


  async showTokenSaleMenu() {
    display.message.paramsRequest('TokenSale');
    const { choice } = await command.prompt(questions.tokenSaleMenu);

    if (choice === 'Base Configuration') {
      display.message.paramsRequest('Presale');
      await this.settings.tokenSale.updateBasicOptions();
      await this.showTokenSaleMenu();

    } else if (choice === 'Cap Configuration') {
      display.message.paramsRequest('Cap Configuration');
      await this.settings.tokenSale.updateCapOptions();
      await this.showTokenSaleMenu();

    } else if (choice === 'Timing Configuration') {
      display.message.paramsRequest('Timing Configuration');
      await this.settings.tokenSale.updateTimeLimits();
      await this.showTokenSaleMenu();

    } else if (choice === 'Advanced Configuration') {
      await this.settings.tokenSale.updateAdvancedOptions();
      await this.showTokenSaleMenu();

    } else if (choice === 'Display Current Configuration') {
      display.showConfiguration(this.settings);
      await display.waitUntilKeyPress();
      await this.showTokenSaleMenu();

    } else if (choice === 'Back') {
      await this.showContractConfigurationMenu();
    }
  }


  async showPresaleMenu() {
    display.message.paramsRequest('TokenSale');
    const { choice } = await command.prompt(questions.tokenSaleMenu);

    if (choice === 'Base Configuration') {
      display.message.paramsRequest('Presale');
      await this.settings.presale.updateBasicOptions();
      await this.showPresaleMenu();

    } else if (choice === 'Cap Configuration') {
      display.message.paramsRequest('Cap Configuration');
      await this.settings.presale.updateCapOptions();
      await this.showPresaleMenu();

    } else if (choice === 'Timing Configuration') {
      display.message.paramsRequest('Timing Configuration');
      await this.settings.presale.updateTimeLimits();
      await this.showPresaleMenu();

    } else if (choice === 'Advanced Configuration') {
      await this.settings.presale.updateAdvancedOptions();
      await this.showPresaleMenu();

    } else if (choice === 'Display Current Configuration') {
      display.showConfiguration(this.settings);
      await display.waitUntilKeyPress();
      await this.showPresaleMenu();

    } else if (choice === 'Back') {
      await this.showContractConfigurationMenu();
    }
  }



  async showCompilerMenu() {
    const { choice } = await command.prompt(questions.compilerMenu);

    if (choice === 'Compile All Contracts') {
      const contracts = Options.getLocalContracts()
      const params = {bytecode: false, abi: false, output: false}

      var [error, result] = await until(this.compiler.compileContracts(contracts, params))

      if (error) {
        console.log(error)
      } else {
        display.compileSuccess()
      }

    } else if (choice === 'Compile Contract') {
      const choice = await this.showContractMenu({ additionalFields: [] });
      const params = {bytecode: false, abi: false, output: false}

      var [error, result] = await until(this.compiler.compileContracts([choice], params))

      if (error) {
        console.log(error)
      } else {
        display.compileSuccess()
      }
    }

    await display.waitUntilKeyPress();
    await this.showMainMenu();
  }


  async showContractMenu({ additionalFields = [] }) {
    const optionsList = this.settings.getIncludedContracts().uncamelize();
    additionalFields.forEach((field) => { optionsList.push(field); });
    const menu = questions.contractOptionsList(optionsList);
    const { choice } = await command.prompt(menu);
    return choice;
  }

  async saveSettings() {
    try {
      this.settings.save();
      display.message.configurationSaved();
      await display.waitUntilKeyPress();
    }
    catch(e) {
      if (e instanceof Error) {
        display.message.configurationNotSaved(e);
        await display.waitUntilKeyPress();
      }
    }
  }


  async loadSettings() {
    try {
      this.settings.load();
      display.message.configurationLoaded();
      await display.waitUntilKeyPress();
    }
    catch(e) {
      if (e instanceof Error) {
        display.message.configurationNotLoaded();
        await display.waitUntilKeyPress();
      }
    }
  }

}

module.exports = Interface