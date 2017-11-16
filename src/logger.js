const clear = require('clear')

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
    console.log(`Configuration has been loaded properly`)
  }

  configurationSaved() {
    clear();
    console.log(`Configuration has been saved`)
  }

}

module.exports = Logger;