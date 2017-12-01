const command = require('inquirer')
const clear = require('clear')
const path = require('path')
const ora = require('ora')
const Table = require('cli-table2')
const questions = require('./questions')
const cfonts = require('cfonts')
const clikey = require('clikey')
const Logger = require('./logger')
const Options = require('./options/index.js')

const { getContractNames, getTable } = require('./helpers.js')

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

  //TODO human-readable date along with timestamp for the startDate and the endDate
  showConfiguration(configuration) {
    try {
      // clear();
      let contracts = configuration.getIncludedContracts()
      contracts.forEach((contract) => {
        let settings = configuration[contract]
        this.showContractSettings(settings)
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

  localConfiguration() {
    // clear()
    let settings = Options.parseLocalSettings()
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

  // contractInfo(contracts, {code, abi, bytecode}) {
  //   contracts.forEach({


  //     let filePath = getArtifactPath(contractName)
  //     let [error, bytecode] = await until(this.getBytecodeFromFile(filePath))
  //     let [error, json] = await until(readFile(filePath))
  //     if (error) throw new Error('ERROR', 'could not get bytecode')


  //     let filePath = getArtifactPath(contractName)
  //     let [error, abi] = await until(this.getABIFromFile(filePath))
  //     let [error, json] = await until(readFile(filePath))
  //   })


  //   if (code) this.contractCode()
  //   if (abi) this.contractABI()
  //   if (bytecode) this.contractBytecode()
  // }

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
    console.log("Contracts built successfully !")
    console.log("Contracts have been written to the '/lib/contracts/solidity directory")
    console.log("\n********************************************************************* \n")
    await this.waitUntilKeyPress()
  }

  async compileSuccess() {
    console.log("\n********************************************************************* \n")
    console.log("Compilation successful !")
    console.log("Data has been saved to the '/lib/contracts/json directory")
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

