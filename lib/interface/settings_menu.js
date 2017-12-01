require('../utils');

const command = require('inquirer');
const Table = require('cli-table2');
const clear = require('clear');

const questions = require('../questions');
command.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const Options = require('../options/index.js');
const Display = require('../display.js');
const Config = require('../config.js')

const display = new Display();
const config = new Config();

class SettingsMenu {

  constructor(settings) {
    this.settings = settings || new Options({})
  }

  async start() {
    await this.showConfigurationMenu()
  }

  async showConfigurationMenu() {
    display.message.configurationMenu();
    let menu = questions.contractConfigurationMenu({additionalFields: ['Close']})
    const options = await command.prompt(menu);

    if (options.choice === 'Edit Configuration') {
      await this.showContractSelectionMenu();

    } else if (options.choice === 'Display Current Configuration') {
      display.showConfiguration(this.settings);
      await display.waitUntilKeyPress();

    } else if (options.choice === 'Save Configuration') {
      try {
        this.settings.save();
        display.message.configurationSaved();
        await display.waitUntilKeyPress();
      }
      catch(e) {
        if (e instanceof Error) {
          display.message.configurationNotSaved();
          await display.waitUntilKeyPress();
        }
      }

    } else if (options.choice === 'Load Previous Configuration') {
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

    } else if (options.choice === 'Close') {
      process.exit(1);
    }

    await this.showConfigurationMenu();
  }


  // TODO replace the hardcoded list of contracts by parsing the files in the templates folder
  async showContractSelectionMenu() {
    display.message.contractSelectionMenu();
    const contracts = questions.contractCheckboxList();
    const { choice } = await command.prompt(contracts);
    this.settings.setIncludedContracts(choice);
    await this.showContractConfigurationMenu();
  }

  async showContractConfigurationMenu() {
    display.message.contractConfigurationMenu();

    const additionalFields = ['Back'];
    const choice = await this.showContractMenu({ additionalFields: additionalFields })

    if (choice === 'Presale Token') {
      await this.showPresaleTokenMenu();

    } else if (choice === 'Presale') {
      await this.showPresaleMenu();

    } else if (choice === 'Token') {
      await this.showTokenMenu();

    } else if (choice === 'Token Sale') {
      await this.showTokenSaleMenu();

    } else if (choice === 'Multisig Wallet') {
      await this.requestWalletParameters();

    } else if (choice === 'Display Contract Configuration') {
      display.showConfiguration(this.settings);
      await display.waitUntilKeyPress();
      await this.showContractConfigurationMenu();

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

  async requestWalletParameters() {
    display.message.paramsRequest('Wallet');
    const options = await command.prompt(questions.wallet);
    this.settings.wallet = new WalletOptions(options);
    await this.showContractConfigurationMenu();
  }

  async requestAdvancedOptions() {
    display.message.paramsRequest('Advanced Options');
    const options = await command.prompt(questions.advancedOptions);
    await this.showContractConfigurationMenu();
  }

  async showContractMenu({ additionalFields = [] }) {
    const optionsList = this.settings.getIncludedContracts().uncamelize();
    let choices = optionsList.concat(additionalFields)
    const menu = questions.contractOptionsList(choices);
    const { choice } = await command.prompt(menu);
    return choice;
  }
}

module.exports = SettingsMenu