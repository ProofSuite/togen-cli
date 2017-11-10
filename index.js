'use strict'
const questions = require('./src/questions')
const command = require('inquirer')
const clear = require('clear')
const Table = require('cli-table2')


const { assemble } = require('./src/assembler/index.js')
const { Configuration, TokenOptions, TokenSaleOptions, PresaleOptions, WalletOptions } = require ('./src/options')
const { Compiler } = require('./src/compiler.js')
const { getContractNames, getTable } = require('./src/helpers.js')

command.registerPrompt('datetime', require('inquirer-datepicker-prompt'))

let configuration = new Configuration()
let compiler = new Compiler('./')


main()

function main() {
	displayMenu();
}

//TODO refactor and create a separate display module
async function displayMenu() {
  clear();
  console.log('Welcome to the tokensale generator. Please select among the options below to choose your tokensale options')
  let options = await command.prompt(questions.categories)

  if (options.choice === 'Configure Contracts') {
    await displayContractSelectionMenu();
    displayMenu();
  }
	else if (options.choice === 'Display Contract Configuration') {
    displayCurrentConfiguration();
    await displayReturnToMainMenu();
	}
	else if (options.choice === 'Build Contracts') {
		await assembleContracts(configuration)
		displayMenu();
	}
	else if (options.choice === 'Compile Contracts') {
		await compileContracts(configuration)
		displayMenu();
	}
	else if (options.choice === 'Close') {
		process.exit();
	}
	else if (options.choice === 'Help') {
		displayHelp();
	}
}

//TODO replace the hardcoded list of contracts by parsing the files in the templates folder
async function displayContractSelectionMenu() {
  clear();
  console.log('Select the contracts you want to include in the configuration')
  let contractFiles = ['Presale Tokensale', 'Presale Token', 'Token', 'Token Sale', 'Multisig Wallet']
  let contracts = questions.contractCheckboxList(contractFiles)

  let { choice } = await command.prompt(contracts)
  choice.push('Go to main menu')

  await displayContractConfigurationMenu(choice)
}

async function displayReturnToMainMenu() {
  let options = await command.prompt(questions.returnToMenu)
  displayMenu();
}

async function displayContractConfigurationMenu(contracts) {
  clear();
  let contractList = questions.contractOptionsList(contracts)
  let options = await command.prompt(contractList)

  if (options.choice === 'Token') {
		await displayTokenMenu();
		await displayContractConfigurationMenu(contracts);
	}
	else if (options.choice === 'Token Sale') {
    await displayTokenSaleMenu();
		await displayContractConfigurationMenu(contracts);
  }
  else if (options.choice === 'Presale Token') {
    await displayPresaleTokenMenu();
    await displayContractConfigurationMenu(contracts);
  }
  else if (options.choice === 'Presale Tokensale') {
    await displayPresaleMenu();
    await displayContractConfigurationMenu(contracts);
  }
	else if (options.choice === 'Multisig Wallet') {
		await displayWalletMenu();
		await displayContractConfigurationMenu(contracts);
  }
  else if (options.choice === 'Go to main menu') {
    displayMenu();
  }
}

async function displayTokenMenu() {
  clear();
	console.log('Answer the following questions to configure your token contract')
	let options = await command.prompt(questions.token)
	configuration.token = new TokenOptions(options)
}

async function displayTokenSaleMenu() {
  clear();
	console.log('Answer the following questions to configure your tokensale contract')
	let options = await command.prompt(questions.tokenSale)
	configuration.tokenSale = new TokenSaleOptions(options)
}

async function displayWalletMenu() {
  clear();
	console.log('Answer the following questions to configure wallet options')
	let options = await command.prompt(questions.wallet)
	configuration.wallet = new WalletOptions(options)
}

async function displayPresaleMenu() {
  clear();
  console.log('Answer the following questions to configure your presale contract')
  let options = await command.prompt(questions.presale)
  configuration.presale = new PresaleOptions(options)
}

async function displayPresaleTokenMenu() {
  clear();
  console.log('Answer the following questions to configure your presale token contract')
  let options = await command.prompt(questions.token)
  configuration.presaleToken = new TokenOptions(options)
}




//TODO put colors on the title display
//TODO human-readable date along with timestamp for the startDate and the endDate
function displayCurrentConfiguration() {
  clear();
  let contracts = Object.keys(configuration)

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

async function compileContracts(configuration) {
	console.log("\n********************\n")
	console.log("Contract compilation module\n")
	console.log("This feature is not implemented yet")
  console.log("\n")
  await displayReturnToMainMenu();
}

async function compileOneContract() {
  let contractFiles = await getContracts()
  let contracts = contractList(contractFiles)
  let selectedContract = await command.prompt(contracts)

  await compiler.saveContract(selectedContract)
  console.log("The contract has been written to your folder")
}

async function compileAllContracts() {
  await compile.compileAllContracts()
  console.log("Contracts have been written to your root folder")
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



