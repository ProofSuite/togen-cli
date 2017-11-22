;

require('./lib/utils.js');
const questions = require('./lib/questions');
const command = require('inquirer');
const clear = require('clear');
const Table = require('cli-table2');
const config = require('./config.js');
const assembler = require('./lib/assembler/index.js');

command.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const Options = require('./lib/configuration/configuration.js');
const Compiler = require('./lib/compiler.js');
const Display = require('./lib/display.js');
const configuration = new Configuration();
const compiler = new Compiler(config.artifactsFolder);
const display = new Display(configuration);

// main();

async function main() {
  await showMainMenu();
}

// TODO refactor and create a separate display module
async function showMainMenu() {
  display.message.mainMenu();
  const { choice } = await command.prompt(questions.categories);

  if (choice === 'Configure Contracts') {
    await showConfigurationMenu();
  } else if (choice === 'Display Contract Configuration') {
    display.currentConfiguration(configuration);
    await display.waitUntilKeyPress();
    await showMainMenu();
  } else if (choice === 'Build Contracts') {
    await assembler.build(configuration);
    await display.buildSuccess();
  } else if (choice === 'Compile Contracts') {
    await showCompilerMenu();
  } else if (choice === 'Close') {
    process.exit();
  } else if (choice === 'Help') {
    display.help();
  }
}

async function showConfigurationMenu() {
  display.message.configurationMenu();
  const options = await command.prompt(questions.configurationMenu);

  if (options.choice === 'Edit Configuration') {
    await showContractSelectionMenu();
  } else if (options.choice === 'Display Current Configuration') {
    display.currentConfiguration(configuration);
    await display.waitUntilKeyPress();
  } else if (options.choice === 'Save Configuration') {
    configuration.save();
    display.message.configurationSaved();
    await display.waitUntilKeyPress();
  } else if (options.choice === 'Load Previous Configuration') {
    configuration.load();
    display.message.configurationLoaded();
    await display.waitUntilKeyPress();
  } else if (options.choice === 'Back') {
    await showMainMenu();
  }

  await showConfigurationMenu();
}


// TODO replace the hardcoded list of contracts by parsing the files in the templates folder
async function showContractSelectionMenu() {
  display.message.contractSelectionMenu();
  const contractFiles = ['Presale', 'Presale Token', 'Token', 'Token Sale', 'Multisig Wallet'];
  const contracts = questions.contractCheckboxList(contractFiles);

  const { choice } = await command.prompt(contracts);
  configuration.setIncludedContracts(choice);

  await showContractConfigurationMenu();
}



async function showContractConfigurationMenu() {
  display.message.contractConfigurationMenu();
  const additionalFields = ['Display Contract Configuration', 'Additional Options', 'Go to main menu'];
  const choice = await showContractMenu({ additionalFields: ['Display Contract Configuration', 'Go to main menu'] });

  if (choice === 'Presale Token') {
    await showPresaleTokenMenu();

  } else if (choice === 'Presale') {
    await showPresaleMenu();

  } else if (choice === 'Token') {
    await showTokenMenu();

  } else if (choice === 'TokenSale') {
    await showTokenSaleMenu();

  } else if (choice === 'Multisig Wallet') {
    await requestWalletParameters();

  } else if (choice === 'Display Contract Configuration') {
    display.currentConfiguration(configuration);
    await display.waitUntilKeyPress();
    await showContractConfigurationMenu();

  } else if (choice === 'Advanced Options') {
    await requestAdvancedOptions();

  } else if (choice === 'Back') {
    await showConfigurationMenu();
  }
}

async function showPresaleTokenMenu() {
  display.message.paramsRequest('Token');
  const { choice } = await command.prompt(questions.tokenMenu);

  if (choice === 'Base Configuration') {
    display.message.paramsRequest('Presale Token');
    await configuration.presaleToken.updateBasicOptions();
    await showPresaleTokenMenu();

  } else if (choice === 'Token Type') {
    display.message.paramsRequest('Token Type');
    await configuration.presaleToken.updateTokenStandard();
    await showPresaleTokenMenu();

  } else if (choice === 'Advanced Configuration') {
    await configuration.presaleToken.updateAdvancedOptions();
    await showPresaleTokenMenu();

  } else if (choice === 'Display Current Configuration') {
    display.currentConfiguration(configuration);
    await display.waitUntilKeyPress();
    await showPresaleTokenMenu();

  } else if (choice === 'Back') {
    await showContractConfigurationMenu();
  }
}

async function showTokenMenu() {
  display.message.paramsRequest('Token');
  const { choice } = await command.prompt(questions.tokenMenu);

  if (choice === 'Base Configuration') {
    display.message.paramsRequest('Token');
    await configuration.token.updateBasicOptions();
    await showTokenMenu();

  } else if (choice === 'Token Type') {
    display.message.paramsRequest('Token Type');
    await configuration.token.updateTokenStandard();
    await showTokenMenu();

  } else if (choice === 'Advanced Configuration') {
    await configuration.token.updateAdvancedOptions();
    await showTokenMenu();

  } else if (choice === 'Display Current Configuration') {
    display.currentConfiguration(configuration);
    await display.waitUntilKeyPress();
    await showTokenMenu();

  } else if (choice === 'Back') {
    await showContractConfigurationMenu();
  }
}

async function showTokenSaleMenu() {
  display.message.paramsRequest('TokenSale');
  const { choice } = await command.prompt(questions.tokenSaleMenu);

  if (choice === 'Base Configuration') {
    display.message.paramsRequest('Presale');
    await configuration.tokenSale.updateBasicOptions();
    await showTokenSaleMenu();

  } else if (choice === 'Cap Configuration') {
    display.message.paramsRequest('Cap Configuration');
    await configuration.tokenSale.updateCapOptions();
    await showTokenSaleMenu();

  } else if (choice === 'Timing Configuration') {
    display.message.paramsRequest('Timing Configuration');
    await configuration.tokenSale.updateTimed();
    await showTokenSaleMenu();

  } else if (choice === 'Advanced Configuration') {
    await configuration.tokenSale.updateAdvancedOptions();
    await showTokenSaleMenu();

  } else if (choice === 'Display Current Configuration') {
    display.currentConfiguration(configuration);
    await display.waitUntilKeyPress();
    await showTokenSaleMenu();

  } else if (choice === 'Back') {
    await showContractConfigurationMenu();
  }
}

async function showPresaleMenu() {
  display.message.paramsRequest('TokenSale');
  const { choice } = await command.prompt(questions.tokenSaleMenu);

  if (choice === 'Base Configuration') {
    display.message.paramsRequest('Presale');
    await configuration.presale.updateBasicOptions();
    await showPresaleMenu();

  } else if (choice === 'Cap Configuration') {
    display.message.paramsRequest('Cap Configuration');
    await configuration.presale.updateCapOptions();
    await showPresaleMenu();

  } else if (choice === 'Timing Configuration') {
    display.message.paramsRequest('Timing Configuration');
    await configuration.presale.updateTimeLimits();
    await showPresaleMenu();

  } else if (choice === 'Advanced Configuration') {
    await configuration.presale.updateAdvancedOptions();
    await showPresaleMenu();

  } else if (choice === 'Display Current Configuration') {
    display.currentConfiguration(configuration);
    await display.waitUntilKeyPress();
    await showPresaleMenu();

  } else if (choice === 'Back') {
    await showContractConfigurationMenu();
  }
}

async function requestWalletParameters() {
  display.message.paramsRequest('Wallet');
  const options = await command.prompt(questions.wallet);
  configuration.wallet = new WalletOptions(options);
  await showContractConfigurationMenu();
}

async function requestAdvancedOptions() {
  display.message.paramsRequest('Advanced Options');
  const options = await command.prompt(questions.advancedOptions);
  await showContractConfigurationMenu();
}


async function showCompilerMenu() {
  const { choice } = await command.prompt(questions.compilerMenu);

  if (choice === 'Compile All Contracts') {
    const contracts = configuration.getIncludedContracts();
    await compiler.compileAll(contracts);
    await display.compileSuccess();
    console.log('Contracts have been written to your root folder');
  } else if (choice === 'Compile Contract') {
    const choice = await showContractMenu({ additionalFields: [] });
    await compiler.compile(choice);
    await display.compileSuccess();
    console.log('Contracts have been written to your root folder');
  } else if (choice === 'Print Bytecode') {
    const choice = await showContractMenu({ additionalFields: [] });
    const bytecode = await compiler.getByteCode(choice);
    console.log(bytecode);
    await display.waitUntilKeyPress();
  } else if (choice === 'Print ABI') {
    const choice = await showContractMenu({ additionalFields: [] });
    const ABI = await compiler.getABI(choice);
    console.log(ABI);
    await display.waitUntilKeyPress();
  }

  await showMainMenu();
}


async function showContractMenu({ additionalFields = [] }) {
  console.log(additionalFields);
  const optionsList = configuration.getIncludedContracts().uncamelize();
  additionalFields.forEach((field) => { optionsList.push(field); });
  const menu = questions.contractOptionsList(optionsList);
  const { choice } = await command.prompt(menu);
  return choice;
}

module.exports = { main }