require('./utils.js')
const command = require('inquirer')
const h = require('./helpers.js')
const questions = require('./questions')
let { TokenOptions, TokenSaleOptions, WalletOptions } = require('./options.js')

class Configuration {
	constructor(tokenOptions = {}, tokenSaleOptions = {}, walletOptions = {}, presaleTokenOptions = {}, presaleOptions = {}) {
		this.token = new TokenOptions(tokenOptions)
    this.tokenSale = new TokenSaleOptions(tokenSaleOptions)
    this.presaleToken = new TokenOptions(presaleTokenOptions)
    this.presale = new TokenSaleOptions(presaleOptions)
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

  async updateTokenType() {
    let options = await command.prompt(questions.tokenType)
    this.token.type = options.choice
  }

  async updatePresaleToken() {
    let options = await command.prompt(questions.token)
    this.presaleToken = new TokenOptions(options)
  }

  async updatePresaleTokenType() {
    let options = await command.prompt(questions.tokenType)
    this.presaleToken.type = options.choice
  }

  async updateTokenSaleType() {
    let options = await command.prompt(questions.tokenSaleType)
    this.tokenSale.capped = options.capped
    options.capped ? this.tokenSale.cap = options.cap : this.tokenSale.cap = 0
  }

  async updateTokenSaleCustomOptions() {
    let options = await command.prompt(questions.tokenSaleAdditionalConfiguration)

    if (options.proxy) {
      this.tokenSale.proxyBalanceOf = true
      this.tokenSale.proxyTotalSupply = true
    } else {
      this.tokenSale.proxyBalanceOf = false
      this.tokenSale.proxyTotalSupply = false
    }

  }

  async updateTokenSale() {
    let options = await command.prompt(questions.tokenSale)
    this.tokenSale = new TokenSaleOptions(options)
  }

  async updatePresale() {
    let options = await command.prompt(questions.tokenSale)
    this.presale = new TokenSaleOptions(options)
  }

  async updatePresaleType() {
    let { type, cap } = await command.prompt(questions.tokenSaleType)
    console.log(type)
    console.log(cap)
    if (type == 'Capped') {
      this.presale.capped = true
      this.presale.cap = cap
    } else {
      this.presale.capped = false
    }
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

  //TODO refactor
  async loadConfiguration() {
    let json = await h.readFile('./src/contracts/configuration.json')
    let savedConfiguration = JSON.parse(json)
    this.token = new TokenOptions(savedConfiguration.token)
    this.presaleToken = new TokenOptions(savedConfiguration.presaleToken)
    this.tokenSale = new TokenSaleOptions(savedConfiguration.tokenSale)
    this.presale = new TokenSaleOptions(savedConfiguration.presale)
    this.wallet = new WalletOptions(savedConfiguration.wallet)
    this.includedContracts = savedConfiguration.includedContracts
  }

}

module.exports = Configuration