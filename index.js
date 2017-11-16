'use strict'

require('./src/utils.js')
const questions = require('./src/questions')
const command = require('inquirer')
const clear = require('clear')
const Table = require('cli-table2')
const config = require('./config.js')
const assembler = require('./src/assembler/index.js')

command.registerPrompt('datetime', require('inquirer-datepicker-prompt'))

const Configuration = require('./src/configuration.js')
const Compiler = require('./src/compiler.js')
const Display = require('./src/display.js')

let configuration = new Configuration()
let compiler = new Compiler(config.artifactsFolder)
let display = new Display(configuration)

main()

async function main() {
	await showMainMenu();
}

//TODO refactor and create a separate display module
async function showMainMenu() {

  display.message.mainMenu();
  let { choice } = await command.prompt(questions.categories)

  if (choice === 'Configure Contracts') {
    await showConfigurationMenu();
  }
	else if (choice === 'Display Contract Configuration') {
    display.currentConfiguration(configuration)
    await display.waitUntilKeyPress();
    await showMainMenu();
	}
	else if (choice === 'Build Contracts') {
    await assembler.build(configuration)
    await display.buildSuccess()
	}
	else if (choice === 'Compile Contracts') {
    await showCompilerMenu()
	}
	else if (choice === 'Close') {
		process.exit();
	}
	else if (choice === 'Help') {
		display.help();
  }

}


async function showConfigurationMenu() {
  display.message.configurationMenu();
  let options = await command.prompt(questions.configurationMenu)

  if (options.choice === 'New Configuration') {
    await showContractSelectionMenu();
  }
  else if (options.choice === 'Display Current Configuration') {
    display.currentConfiguration(configuration);
    await display.waitUntilKeyPress()
  }
  else if (options.choice === 'Save Configuration') {
    configuration.saveConfiguration()
    display.message.configurationSaved();
    await display.waitUntilKeyPress();
  }
  else if (options.choice === 'Load Previous Configuration') {
    configuration.loadConfiguration()
    display.message.configurationLoaded();
    await display.waitUntilKeyPress();
  }
  else if (options.choice === 'Back') {
    await showMainMenu();
  }

  await showConfigurationMenu();
}


//TODO replace the hardcoded list of contracts by parsing the files in the templates folder
async function showContractSelectionMenu() {
  display.message.contractSelectionMenu()
  let contractFiles = ['Presale', 'Presale Token', 'Token', 'Token Sale', 'Multisig Wallet']
  let contracts = questions.contractCheckboxList(contractFiles)

  let { choice } = await command.prompt(contracts)
  configuration.setIncludedContracts(choice)

  await showContractConfigurationMenu()
}


async function showContractConfigurationMenu() {
  display.message.contractConfigurationMenu();
  let choice = await showContractMenu({ additionalFields: ['Display Contract Configuration', 'Go to main menu']})

  if (choice === 'Token') {
    await requestTokenParameters();
	}
	else if (choice === 'Token Sale') {
    await requestTokenSaleParameters();
  }
  else if (choice === 'Presale Token') {
    await requestPresaleTokenParameters();
  }
  else if (choice === 'Presale') {
    await requestPresaleParameters();
  }
	else if (choice === 'Multisig Wallet') {
		await requestWalletParameters();
  }
  else if (choice === 'Display Contract Configuration') {
    display.currentConfiguration(configuration);
    await display.waitUntilKeyPress()
    await showContractConfigurationMenu()
  }
  else if (choice === 'Go to main menu') {
    await showMainMenu();
  }
}

async function requestTokenParameters() {
  display.message.paramsRequest('Token');
  await configuration.updateToken()
  display.message.paramsRequest('Token Type')
  await configuration.updateTokenType();
  await showContractConfigurationMenu()
}

async function requestPresaleTokenParameters() {
  display.message.paramsRequest('Presale Token');
  await configuration.updatePresaleToken()
  display.message.paramsRequest('Presale Token Type');
  await configuration.updatePresaleTokenType()
  await showContractConfigurationMenu()
}

async function requestTokenSaleParameters() {
  display.message.paramsRequest('Token Sale');
  await configuration.updateTokenSale();
  display.message.paramsRequest('Token Sale Type');
  await configuration.updateTokenSaleType();
  display.message.paramsRequest('Additional Options');
  await configuration.updateTokenSaleCustomOptions();
  await showContractConfigurationMenu()
}

async function requestPresaleParameters() {
  display.message.paramsRequest('Presale');
  await configuration.updatePresale();
  display.message.paramsRequest('Presale Type');
  await configuration.updatePresaleType();
  await showContractConfigurationMenu();
}

async function requestWalletParameters() {
  display.message.paramsRequest('Wallet')
	let options = await command.prompt(questions.wallet)
  configuration.wallet = new WalletOptions(options)
  await showContractConfigurationMenu()
}


async function showCompilerMenu() {
  let { choice } = await command.prompt(questions.compilerMenu)

  if (choice === 'Compile All Contracts') {
    let contracts = configuration.getIncludedContracts()
    await compiler.compileAll(contracts)
    await display.compileSuccess()
    console.log("Contracts have been written to your root folder")
  }
  else if (choice === 'Compile Contract') {
    let choice = await showContractMenu({additionalFields: []})
    await compiler.compile(choice)
    await display.compileSuccess()
    console.log("Contracts have been written to your root folder")
  }
  else if (choice === 'Print Bytecode') {
    let choice = await showContractMenu({additionalFields: []})
    let bytecode = await compiler.getByteCode(choice)
    console.log(bytecode)
    await display.waitUntilKeyPress()
  }
  else if (choice === 'Print ABI') {
    let choice = await showContractMenu({additionalFields: []})
    let ABI = await compiler.getABI(choice)
    console.log(ABI)
    await display.waitUntilKeyPress()
  }

  await showMainMenu();
}


async function showContractMenu({additionalFields = []}) {
  let optionsList = configuration.getIncludedContracts().uncamelize()
  additionalFields.forEach((field) => { optionsList.push(field) })
  let menu = questions.contractOptionsList(optionsList)
  let { choice } = await command.prompt(menu)
  return choice
}



