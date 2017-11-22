require('../utils.js')
const command = require('inquirer')
const h = require('../helpers.js')
const fs = require('fs')
const questions = require('../questions')

const TokenOptions = require('./tokenOptions.js')
const TokenSaleOptions = require('./tokenSaleOptions.js')
const WalletOptions = require('./walletOptions.js')
const Config = require('../config')

let config = new Config()


class Options {
	constructor(tokenOptions = {}, tokenSaleOptions = {}, walletOptions = {}, presaleTokenOptions = {}, presaleOptions = {}) {

    tokenOptions.type = "TOKENSALE"
    tokenSaleOptions.type = "TOKENSALE"
    presaleTokenOptions.type = "PRESALE"
    presaleOptions.type = "PRESALE"

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

  includesContract(contract) {
    let contracts = this.getIncludedContracts()
    return !(contracts.indexOf(contract) == -1)
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

  allowPresaleTokenTransferLock(value) {
    if (!this.includesContract('Presale Token')) return false
    if (!this.includesContract('Presale')) return false

    this.presaleToken.allowTokenTransfersLock(value)
    this.presale.allowTokenTransfersLock(value)
  }

  allowTokenSaleTokenTransferLock(value) {
    if (!this.includesContract('Token')) return false
    if (!this.includesContract('TokenSale')) return false

    this.token.allowTokenTransfersLock(value)
    this.tokenSale.allowTokenTransfersLock(value)
  }

  async updatePresaleToken() {
    let options = await command.prompt(questions.token)
    this.presaleToken = new TokenOptions(options)
  }

  async updateToken() {
    let options = await command.prompt(questions.token)
    this.token = new TokenOptions(options)
  }

  async updateTokenSale() {
    let options = await command.prompt(questions.tokenSale)
    options.isPresale = false
    this.tokenSale = new TokenSaleOptions(options)
  }

  async updatePresale() {
    let options = await command.prompt(questions.tokenSale)
    options.isPresale = true
    this.presale = new TokenSaleOptions(options)
  }

  save() {
    let json = JSON.stringify(this)
    config.updateLocalContractSettings(json)
  }

  saveGlobally() {
    let json = JSON.stringify(this)
    config.updateGlobalContractSettings(json)
  }

  load() {
    let json = config.localContractSettings()
    this.token = new TokenOptions(json.token)
    this.presaleToken = new TokenOptions(json.presaleToken)
    this.tokenSale = new TokenSaleOptions(json.tokenSale)
    this.presale = new TokenSaleOptions(json.presale)
    this.includedContract = json.includedContracts
  }

}

module.exports = Options