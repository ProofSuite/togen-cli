require('./utils.js')
const command = require('inquirer')
const h = require('./helpers.js')
const questions = require('./questions')
let { TokenOptions, TokenSaleOptions, PresaleOptions, WalletOptions } = require('./options.js')

class Configuration {
	constructor(tokenOptions = {}, tokenSaleOptions = {}, walletOptions = {}, presaleTokenOptions = {}, presaleOptions = {}) {
		this.token = new TokenOptions(tokenOptions)
    this.tokenSale = new TokenSaleOptions(tokenSaleOptions)
    this.presaleToken = new TokenOptions(presaleTokenOptions)
    this.presale = new PresaleOptions(presaleOptions)
    this.wallet = new WalletOptions(walletOptions)

    this.includedContracts = {
      token: tokenOptions.isSet(),
      tokenSale: tokenSaleOptions.isSet(),
      presaleToken: presaleTokenOptions.isSet(),
      presale: presaleOptions.isSet()
    }
  }

  getContracts() {
    return Object.keys(this.includedContracts)
  }

  getIncludedContracts() {
    let isTrue = function(value) { return (value == true) }
    let contracts = this.includedContracts.filterValues(isTrue)
    return Object.keys(contracts)
  }

  setIncludedContracts(values) {
    let contracts = this.getContracts()
    let includedContracts = values.camelize()

    contracts.forEach((contract) => {
      if (includedContracts.indexOf(contract) != -1) {
        this.includedContracts[contract] = true
      } else {
        this.includedContracts[contract] = false
      }
    })
  }

  isValid() {
    let contracts = this.getIncludedContracts().camelize()
    let valid = true;
    contracts.forEach((contract) => {
      if (!this[contract].isComplete()) {
        valid = false;
      }
    })

    return valid
  }

  async updateToken() {
    let options = await command.prompt(questions.token)
    this.token = new TokenOptions(options)
  }

  async updateTokenSale() {
    let options = await command.prompt(questions.tokenSale)
    this.tokenSale = new TokenSaleOptions(options)
  }

  async updatePresale() {
    let options = await command.prompt(questions.presale)
    this.presale = new PresaleOptions(options)
  }

  async updatePresaleToken() {
    let options = await command.prompt(questions.token)
    this.presaleToken = new TokenOptions(options)
  }

  deleteToken() {
    this.token = {}
    this.includedContracts["token"] = false
  }

  deleteTokenSale() {
    this.tokenSale = {}
    this.includedContracts["tokenSale"] = false
  }

  deletePresaleToken() {
    this.presaleToken = {}
    this.includedContracts["presaleToken"] = false
  }

  deletePresale() {
    this.presale = {}
    this.includedContracts["presale"] = false
  }

  deleteWallet() {
    this.wallet = {}
    this.includedContracts["wallets"] = false
  }

  async saveConfiguration() {
    let json = JSON.stringify(this)
    await h.writeFile('./src/contracts/configuration.json', json)
  }

  async loadConfiguration() {
    let json = await h.readFile('./src/contracts/configuration.json')
    let savedConfiguration = JSON.parse(json)
    Object.keys(this).forEach((key) => {
      this[key] = savedConfiguration[key]
    })
  }
}

module.exports = { Configuration }