require('../utils.js')
const command = require('inquirer')
const h = require('../helpers.js')
const fs = require('fs-extra')
const questions = require('../questions')
const path = require('path')

const TokenOptions = require('./tokenOptions.js')
const TokenSaleOptions = require('./tokenSaleOptions.js')
const WalletOptions = require('./walletOptions.js')
const Config = require('../config')
const { isNonEmptyObject } = require('../validators.js')

let config = new Config()

//TODO replace parameters by a single JSON structure
//TODO think about the name ? Parameters ? Settings ? What about the arguments name ?
class Options {
	constructor(settings) {

		this.token = new TokenOptions(settings.token || {}, "TOKENSALE")
    this.tokenSale = new TokenSaleOptions(settings.tokenSale || {} , "TOKENSALE")
    this.presaleToken = new TokenOptions(settings.presaleToken || {}, "PRESALE")
    this.presale = new TokenSaleOptions(settings.presale || {}, "PRESALE")
    this.wallet = new WalletOptions(settings.wallet || {})

    if (settings.includedContracts) {
      this.includedContracts = settings.includedContracts
    }
    else {
      this.includedContracts = {
        token: false,
        tokenSale: false,
        presale: false,
        presaleToken: false,
        wallet: false
      }
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

  validSettings() {
    try {
      let contracts = this.getIncludedContracts().camelize()
      console.log("valid settings, contracts", contracts)
      contracts.forEach((contract) => { this[contract].verifySettings() })
      return true

    }
    catch(e) {
      console.log("catching an error in valid settings")
      if (e instanceof Error) return false
    }
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
    if (!this.validSettings()) throw new Error('Could not save configuration')
    config.updateLocalSettings(json)
  }

  saveFromJSON(json) {
    config.updateLocalSettings(json)
  }

  saveGlobally() {
    let json = JSON.stringify(this)
    config.updateGlobalContractSettings(json)
  }

  saveGloballyFromJSON(json) {
    config.updateGlobalContractSettings(json)
  }

  //TODO refactor
  load() {
    let settings = Options.parseSettings(config.localSettingsFile)
    settings = JSON.parse(settings)
    if (!settings) throw new Error('Could not load configuration')

    this.includedContracts = settings.includedContracts
    this.token = new TokenOptions(settings.token)
    this.presaleToken = new TokenOptions(settings.presaleToken)
    this.tokenSale = new TokenSaleOptions(settings.tokenSale)
    this.presale = new TokenSaleOptions(settings.presale)
  }

  static getLocal() {
    let settings = Options.parseLocalSettings()
    return new Options(settings)
  }

  static getLocalContracts() {
    let settings = Options.parseLocalSettings()
    let options = new Options(settings)
    return options.getIncludedContracts()
  }

  static getDefault() {
    let settings = Options.parseDefaultSettings()
    return new Options(settings)
  }

  static parseSettings(filePath) {
    filePath = path.normalize(filePath)
    let settings = fs.readJSONSync(filePath)
    return settings
  }

  static parseLocalSettings() {
    let settings = fs.readJSONSync(config.localSettingsFile)
    return settings
  }

  static parseDefaultSettings() {
    let settings = fs.readJSONSync(config.defaultSettingsFile)
    return settings
  }
}


module.exports = Options