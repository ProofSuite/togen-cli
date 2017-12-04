const clear = require('clear')
const symbols = require('log-symbols')

class Logger {

  constructor() {

  }

  mainMenu() {
    clear();
    console.log('Welcome to the tokensale generator. Please select among the options below to choose your tokensale options\n')
  }

  configurationMenu() {
    clear();
    console.log('You can create a new configuration or load a previously saved configuration. This configuration will define the parameters used to generate the token sale smart contract infrastructure\n')
  }

  contractSelectionMenu() {
    clear();
    console.log('Select the contracts you want to include in the configuration\n')
  }

  contractConfigurationMenu() {
    clear();
    console.log('')
  }

  paramsRequest(contractName) {
    clear();
    console.log(`Input the requested parameters to configure your ${contractName} contract\n`)
  }

  configurationLoaded() {
    clear();
    console.log(symbols.success, `Configuration has been loaded properly`)
  }

  configurationNotLoaded() {
    clear();
    console.log(symbols.error, `Configuration could not be loaded`)
  }

  configurationSaved() {
    clear();
    console.log(symbols.success, `Configuration has been saved`)
  }

  configurationNotSaved() {
    clear();
    console.log(symbols.error, `Configuration could not be saved`)
  }

  configurationComplete() {
    console.log(symbols.success, `Configuration is complete`)
  }

  configurationNotComplete() {
    console.log(symbols.error, `Configuration is not complete`)
  }

  updateCapOptions() {

  }
}

module.exports = Logger;