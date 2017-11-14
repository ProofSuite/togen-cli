const command = require('inquirer')
const clear = require('clear')
const Table = require('cli-table2')
const questions = require('./questions')
const config = require('../config.js')
const clikey = require('clikey')


const { assembler } = require('./assembler/index.js')
const { TokenOptions, TokenSaleOptions, PresaleOptions, PresaleTokenOptions } = require ('./options')
const { Configuration } = require('./configuration')
const { Compiler } = require('./compiler.js')
const { getContractNames, getTable } = require('./helpers.js')

command.registerPrompt('datetime', require('inquirer-datepicker-prompt'))

let configuration = new Configuration()
let compiler = new Compiler(config.artifactsFolder)


//TODO put colors with chalk.js
class Display {

  constructor(configuration) {
    this.configuration = configuration //not sure if this is necessary
  }

  //TODO human-readable date along with timestamp for the startDate and the endDate
  currentConfiguration(configuration) {
    this.clear();
    let contracts = configuration.getIncludedContracts()

    contracts.forEach(function(contract) {
      let table = getTable(configuration[contract])
      console.log(contract.toUpperCase())
      console.log(table)
      console.log("\n")
    })
  }

  async buildSuccess() {
    console.log("\n********************************************************************* \n")
    console.log("Contracts built successfully !")
    console.log("Contracts have been written to the '/src/contracts/solidity directory")
    console.log("\n********************************************************************* \n")
    await this.waitUntilKeyPress()
  }

  async compileSuccess() {
    console.log("\n********************************************************************* \n")
    console.log("Compilation successful !")
    console.log("Data has been saved to the '/src/contracts/json directory")
    console.log("\n********************************************************************* \n")
    await this.waitUntilKeyPress()
  }

  contractsCompilationFailure() {

  }

  contractsBuildSuccess() {

  }

  contractsBuildFailure() {

  }

  contractBytecode() {

  }

  contractInterface() {

  }

  help() {

  }

  async waitUntilKeyPress() {
    await clikey('Press any key to continue ...')
  }

  mainMenuMessage() {
    this.clear();
    console.log('Welcome to the tokensale generator. Please select among the options below to choose your tokensale options\n')
  }

  configurationMenuMessage() {
    this.clear();
    console.log('You can create a new configuration or load a previously saved configuration. This configuration will define the parameters used to generate the token sale smart contract infrastructure\n')
  }

  contractSelectionMenuMessage() {
    this.clear();
    console.log('Select the contracts you want to include in the configuration\n')
  }

  contractConfigurationMenuMessage() {
    this.clear();
    console.log('')
  }

  paramsRequestMessage(contractName) {
    this.clear();
    console.log(`Input the requested parameters to configure your ${contractName} contract\n`)
  }

  configurationLoaded() {
    console.log('Previous token sale configuration has been loaded correctly')
  }

  configurationSaved() {
    console.log('Token Sale configuration has been saved correctly')
  }

  clear() {
    clear();
  }

}


module.exports = { Display }

