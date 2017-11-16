const command = require('inquirer')
const clear = require('clear')
const Table = require('cli-table2')
const questions = require('./questions')
const config = require('../config.js')
const clikey = require('clikey')

const Logger = require('./logger')
const Configuration = require('./configuration')

const { getContractNames, getTable } = require('./helpers.js')

command.registerPrompt('datetime', require('inquirer-datepicker-prompt'))


//TODO put colors with chalk.js
//TODO refactor message class correctly
class Display {

  constructor(configuration) {
    this.configuration = configuration //not sure if this is necessary
    this.message = new Logger()
  }

  //TODO human-readable date along with timestamp for the startDate and the endDate
  currentConfiguration(configuration) {
    clear();
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

}


module.exports = Display

