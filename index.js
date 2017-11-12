'use strict'
require('./src/utils.js')
const questions = require('./src/questions')
const command = require('inquirer')
const clear = require('clear')
const Table = require('cli-table2')
const config = require('./config.js')


const { assemble } = require('./src/assembler/index.js')
const { Configuration, TokenOptions, TokenSaleOptions, PresaleOptions, WalletOptions, IncludedContracts } = require ('./src/options')
const { Compiler } = require('./src/compiler.js')
const { getContractNames, getTable } = require('./src/helpers.js')

command.registerPrompt('datetime', require('inquirer-datepicker-prompt'))

let configuration = new Configuration()
let compiler = new Compiler(config.artifactsFolder)

main()

function main() {
	displayMainMenu();
}

//TODO refactor and create a separate display module
async function displayMainMenu() {
  //// clear();
  console.log('Welcome to the tokensale generator. Please select among the options below to choose your tokensale options')
  let options = await command.prompt(questions.categories)

  if (options.choice === 'Configure Contracts') {
    await displayConfigurationMenu();
  }
	else if (options.choice === 'Display Contract Configuration') {
    displayCurrentConfiguration();
    await displayReturnToMainMenu();
	}
	else if (options.choice === 'Build Contracts') {
		await assembleContracts(configuration)
		displayMainMenu();
	}
	else if (options.choice === 'Compile Contracts') {
    await displayCompilerMenu()
		displayMainMenu();
	}
	else if (options.choice === 'Close') {
		process.exit();
	}
	else if (options.choice === 'Help') {
		displayHelp();
  }
}


async function displayConfigurationMenu() {
  let options = await command.prompt(questions.configurationMenu)

  if (options.choice === 'New Configuration') {
    await displayContractSelectionMenu();
  }
  else if (options.choice === 'Display Current Configuration') {
    displayCurrentConfiguration();
    await displayReturnToConfigurationMenu();
  }
  else if (options.choice === 'Save Configuration') {
    configuration.saveConfiguration()
    await displayReturnToConfigurationMenu();
  }
  else if (options.choice === 'Load Previous Configuration') {
    configuration.loadConfiguration()
    await displayReturnToConfigurationMenu();
  }
  else if (options.choice === 'Back') {
    displayMainMenu();
  }
}


//TODO replace the hardcoded list of contracts by parsing the files in the templates folder
async function displayContractSelectionMenu() {
  clear();
  console.log('Select the contracts you want to include in the configuration')
  let contractFiles = ['Presale', 'Presale Token', 'Token', 'Token Sale', 'Multisig Wallet']
  let contracts = questions.contractCheckboxList(contractFiles)

  let { choice } = await command.prompt(contracts)
  configuration.setIncludedContracts(choice)

  await displayContractConfigurationMenu()
}


async function displayContractConfigurationMenu() {

  let optionsList = configuration.getIncludedContracts().uncamelize()
  optionsList.push('Display Contract Configuration')
  optionsList.push('Go to main menu')

  let menu = questions.contractOptionsList(optionsList)
  let options = await command.prompt(menu)

  if (options.choice === 'Token') {
		await displayTokenMenu();
	}
	else if (options.choice === 'Token Sale') {
    await displayTokenSaleMenu();
  }
  else if (options.choice === 'Presale Token') {
    await displayPresaleTokenMenu();
  }
  else if (options.choice === 'Presale') {
    await displayPresaleMenu();
  }
	else if (options.choice === 'Multisig Wallet') {
		await displayWalletMenu();
  }
  else if (options.choice === 'Display Contract Configuration') {
    displayCurrentConfiguration();
    await displayReturnToContractConfigurationMenu();
  }
  else if (options.choice === 'Go to main menu') {
    displayMainMenu();
  }
}

async function displayTokenMenu() {
  clear();
	console.log('Answer the following questions to configure your token contract')
	let options = await command.prompt(questions.token)
  configuration.token = new TokenOptions(options)
  await displayContractConfigurationMenu()
}

async function displayTokenSaleMenu() {
  clear();
	console.log('Answer the following questions to configure your tokensale contract')
	let options = await command.prompt(questions.tokenSale)
  configuration.tokenSale = new TokenSaleOptions(options)
  await displayContractConfigurationMenu()
}

async function displayWalletMenu() {
  clear();
	console.log('Answer the following questions to configure wallet options')
	let options = await command.prompt(questions.wallet)
  configuration.wallet = new WalletOptions(options)
  await displayContractConfigurationMenu()
}

async function displayPresaleMenu() {
  clear();
  console.log('Answer the following questions to configure your presale contract')
  let options = await command.prompt(questions.presale)
  configuration.presale = new PresaleOptions(options)
  await displayContractConfigurationMenu()
}

async function displayPresaleTokenMenu() {
  clear();
  console.log('Answer the following questions to configure your presale token contract')
  let options = await command.prompt(questions.token)
  configuration.presaleToken = new TokenOptions(options)
  await displayContractConfigurationMenu()
}

async function displayCompilerMenu() {
  let options = await command.prompt(questions.compilerMenu)

  if (options.choice === 'Compile All Contracts') {
    let contracts = configuration.getIncludedContracts()
    await compiler.compileAll(contracts)
    console.log("Contracts have been written to your root folder")
    await displayReturnToMainMenu();
  }
  else if (options.choice === 'Compile Contract') {
    let choice = await displayContractMenu()
    await compiler.compile(choice)
    console.log("Contracts have been written to your root folder")
    await displayReturnToMainMenu();
  }
  else if (options.choice === 'Print Bytecode') {
    let choice = await displayContractMenu()
    let bytecode = await compiler.getByteCode(choice)
    console.log(bytecode)
    await displayReturnToMainMenu();
  }
  else if (options.choice === 'Print ABI') {
    let choice = await displayContractMenu()
    let ABI = await compiler.getABI(choice)
    console.log(ABI)
    await displayReturnToMainMenu();
  }
}

async function displayContractMenu() {
  let optionsList = configuration.getIncludedContracts().uncamelize()
  let menu = questions.contractOptionsList(optionsList)
  let options = await command.prompt(menu)
  return options.choice
}


//TODO put colors on the title display
//TODO human-readable date along with timestamp for the startDate and the endDate
function displayCurrentConfiguration() {
  clear();
  let contracts = configuration.getIncludedContracts()

  contracts.forEach(function(contract) {
    let table = getTable(configuration[contract])
    console.log(contract.toUpperCase())
    console.log(table)
    console.log("\n")
  })
}

//TODO change the folder where the contract will be written
//TODO add errors depending on outcome
async function assembleContracts(configuration) {
	await assemble(configuration)
	console.log("\n********************\n")
	console.log("\nContracts have been written to the '/src/contracts/solidity directory\n")
  console.log("\n")
  await displayReturnToMainMenu();
}


async function getContractABI(contract) {
  let contractFiles = await getContracts()
  let contracts = contractList(contractFiles)
  let selectedContract = await command.prompt(contracts)
  let abi = compiler.getABI(selectedContract)
  console.log(abi)
}

async function getContractBytecode() {
  let contractFiles = await getContracts()
  let contracts = contractList(contractFiles)
  let selectedContract = await command.prompt(contracts)
  let bytecode = await compiler.getByteCode(selectedContract)
  console.log(bytecode)
}

function displayHelp() {
	console.log('The help section has not been created yet.')
}

async function displayReturnToMainMenu() {
  let options = await command.prompt(questions.returnToMenu)
  displayMainMenu();
}

async function displayReturnToConfigurationMenu() {
  let options = await command.prompt(questions.returnToMenu)
  clear();
  displayConfigurationMenu();
}

async function displayReturnToContractConfigurationMenu() {
  let options = await command.prompt(questions.returnToMenu)
  clear();
  displayContractConfigurationMenu()
}




