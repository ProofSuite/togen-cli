const chalk = require('chalk')
const command = require('inquirer')
const clear = require('clear')
const path = require('path')
const ora = require('ora')
const symbols = require('log-symbols')
const Table = require('cli-table2')
const questions = require('./questions')
const cfonts = require('cfonts')
const clikey = require('clikey')
const Logger = require('./logger')
const Options = require('./options/index.js')

const { getTable } = require('./helpers.js')

command.registerPrompt('datetime', require('inquirer-datepicker-prompt'))


//TODO put colors with chalk.js
//TODO refactor message class correctly
class Display {

  constructor() {
    this.message = new Logger()
    this.spinner = new ora()
  }

  header() {
    CFonts.say('togen', {
      font: 'block',        //define the font face
      align: 'left',        //define text alignment
      colors: ['white'],    //define all colors
      background: 'Black',  //define the background color
      letterSpacing: 1,     //define letter spacing
      lineHeight: 1,        //define the line height
      space: true,          //define if the output text should have empty lines on top and on the bottom
      maxLength: '0'        //define how many character can be on one line
    });
  }

  showIncludedContracts(configuration) {
    let allContracts = configuration.getContracts()
    let includedContracts = configuration.getIncludedContracts()

    console.log('\n')
    console.log('INCLUDED CONTRACTS')

    allContracts.forEach((contract) => {
      if (includedContracts.includes(contract)) {
        console.log(symbols.success, contract)
      }
      else {
        console.log(symbols.error, contract)
      }
    })

    console.log('\n')
  }

  //TODO human-readable date along with timestamp for the startDate and the endDate
  showConfiguration(configuration) {
    try {
      clear();
      let contracts = configuration.getIncludedContracts()
      this.showIncludedContracts(configuration)

      contracts.forEach((contract) => {
        let settings = configuration[contract]
        console.log('\n')
        console.log(contract.toUpperCase())
        this.showContractSettings(settings)
        console.log('\n')
        this.showSettingsStatus(settings)
        console.log('\n')
      })
    }

    catch(e) {
      throw (e);
    }
  }

  showContractSettings(settings) {
    let table = getTable(settings)
    console.log(table)
  }

  deploymentSettings(settings) {
    let table = getTable(settings)
    console.log(table)
  }

  showSettingsStatus(settings) {
    try {
      settings.verifySettings()
      this.message.configurationComplete()
    }
    catch(e) {
      if (e instanceof Error) {
        this.message.configurationNotComplete()
      }
    }
  }

  async localConfiguration() {
    // clear()
    let settings = await Options.parseLocalSettings()
    let options = new Options(settings)
    this.showConfiguration(options)
  }

  defaultConfiguration() {
    // clear()
    let settings = Options.parseDefaultSettings()
    let options = new Options(settings)
    this.showConfiguration(options)
  }

  fileConfiguration(file) {
    // clear()
    let settings = Options.parseSettings(file)
    let options = new Options(settings)
    this.showConfiguration(options)
  }

  contractInfo(contracts, {code, abi, bytecode}) {

  }

  //TODO make a pretty print
  contractCode(code) {
    console.log("\n*********************")
    console.log(code)
    console.log("*********************")
  }

  contractABI(abi) {
    console.log("\n*********************")
    console.log(abi)
    console.log("*********************")
  }

  contractBytecode(bytecode) {
    console.log("\n*********************")
    console.log(bytecode)
    console.log("*********************")
  }

  async buildSuccess() {
    console.log("\n********************************************************************* \n")
    console.log(chalk.cyan("Contracts built successfully !"))
    console.log("Contracts have been written to the '/lib/contracts/solidity directory")
    console.log("\n********************************************************************* \n")
    await this.waitUntilKeyPress()
  }

  async compileSuccess() {
    console.log("\n********************************************************************* \n")
    console.log(chalk.cyan("Compilation successful !"))
    console.log("Data has been saved to the '/lib/contracts/json directory")
    console.log("\n********************************************************************* \n")
    await this.waitUntilKeyPress()
  }

  async deploymentSuccess(hash, network) {
    console.log("\n********************************************************************* \n")
    console.log(chalk.cyan("Deployment Successful !"))
    console.log(`https://rinkeby.etherscan.io/tx/${hash}`)
    console.log("\n********************************************************************* \n")
    await this.waitUntilKeyPress()
  }

  wallet(record) {
    process.stdout.write(`\n${chalk.cyan("Network")}: ${record.network}\n`)
    process.stdout.write(`${chalk.cyan("Path")}: ${record.filePath}\n`)
    process.stdout.write(`${chalk.cyan("Address")}: ${record.address}\n\n`)
  }

  privateKey(wallet, address, secret) {
    process.stdout.write(`${chalk.cyan("\nWallet Keystore file")}: ${wallet.filePath}\n`)
    process.stdout.write(`${chalk.cyan("Mnemonic")}: ${secret.seed}\n`)
    process.stdout.write(`${chalk.cyan("Address")}: ${address}\n`)
    process.stdout.write(`${chalk.cyan("Private Key")}: ${secret.privateKey}\n\n`)
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

