const chalk = require('chalk')
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

  configurationNotSaved(e) {
    clear();
    process.stdout.write(`Configuration could not be saved.\n ERROR: ${e.message}\n`)
    console.log(symbols.error, `Configuration could not be saved`)
  }

  configurationComplete() {
    console.log(symbols.success, `Configuration is complete`)
  }

  configurationNotComplete() {
    console.log(symbols.error, `Configuration is not complete`)
  }

  togenNotDetected() {
    console.log(symbols.warning, `settings.json file not detected. Please create a togen directory`)
  }

  exposePrivateKeysWarning() {
    clear()
    console.log(symbols.warning, chalk.yellow('You are about to print your private keys'))
  }

  updateCapOptions() {

  }

  deployerMenu() {
    clear()
    process.stdout.write(`Choose action`)
  }

  accountMenu() {
    clear()
  }

  createWalletMenu() {
    clear()
  }

  defaultWalletMenu() {
    clear()
  }

  deployerMenu() {
    clear()
  }

  deployerSettingsMenu() {
    clear()
  }

  walletAndNetworkUpdated() {

  }

  walletCreated() {
    clear()
    console.log(symbols.success, `Your wallet has been successfully updated`)
  }

  infuraTokenUpdated() {
    clear()
    console.log(symbols.success, `Your infura token has been successfully updated`)
  }

  gasOptionsUpdated() {
    clear()
    console.log(symbols.success, `Gas options have been updated`)
  }

  defaultWalletUpdated() {
    console.log(symbols.success, `The default wallet has been updated`)
  }

  walletDeleted() {
    console.log(symbols.success, `Wallet has been successfully deleted`)
  }


}

module.exports = Logger;