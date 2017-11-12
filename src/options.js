require('./utils.js')
let h = require('./helpers.js')
let { isSet } = require('./validators.js')
let validator = require('./validators.js')


class TokenOptions {

	constructor({decimals, symbol, name}) {

		this.decimals = decimals;
		this.symbol = symbol;
		this.name = name;
  }

  isComplete() {
    try {
      if (!validator.isValidDecimals(this.decimals)) {
        return false
      } else if (!validator.isValidSymbol(this.symbol)) {
        return false
      } else if (!validator.isValidName(this.name)) {
        return false
      }
      return true
    }
    catch(error) {
      return false
    }
  }
}

class TokenSaleOptions {

	constructor({cap, tokenPrice, startDate, endDate, etherWallet}) {
		this.cap = cap;
		this.tokenPrice = tokenPrice;
		this.startDate = h.toTimestamp(startDate);
		this.endDate = h.toTimestamp(endDate);
		this.etherWallet = etherWallet;
  }

  isComplete() {
    try {
      if (!validator.isPositiveNumber(this.cap)) {
        return false
      } else if (!validator.isPositiveNumber(this.tokenPrice)) {
        return false
      }
      return true
    } catch (error) {
      return false
    }
  }

}

class PresaleOptions {

  constructor({wallet, rate, minInvestment, cap}) {
    this.wallet = wallet;
    this.rate = rate;
    this.minInvestment = minInvestment;
    this.cap = cap;
  }

  isComplete() {
    try {
      if (!validator.isValidAddress(this.address)) {
        return false
      } else if (!validator.isPositiveNumber(this.rate)) {
        return false
      } else if (!validator.isPositiveNumber(this.minInvestment)) {
        return false
      } else if (!validator.isPositiveNumber(this.cap)) {
        return false
      }

      return true
    } catch (error) {
      return false
    }
  }
}

class WalletOptions {

	constructor(options) {
    this.multisig = options.multisig;
  }

  isComplete() {
    return (typeof(this.multisig) === "boolean")
  }

}


//TODO split this file in two: options on one and configuration in the other file called configuration.js (+ change the corresponding imports)
class Configuration {
	constructor(contracts = [], tokenOptions = {}, tokenSaleOptions = {}, walletOptions = {}, presaleTokenOptions = {}, presaleOptions = {}) {
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

  setToken(tokenOptions = {}) {
    this.token = new TokenOptions(tokenOptions)
    this.includedContracts["token"] = true
  }

  setTokenSale(tokenSaleOptions = {}) {
    this.tokenSale = new TokenSaleOptions(tokenSaleOptions)
    this.includeContracts["tokenSale"] = true
  }

  setWallet(walletOptions = {}) {
    this.wallet = new WalletOptions(walletOptions)
    this.includedContracts["wallet"] = true
  }

  setPresale(presaleOptions = {}) {
    this.presale = new PresaleOptions(presaleOptions)
    this.includedContracts["presale"] = true
  }

  setPresaleToken(presaleTokenOptions = {}) {
    this.presaleToken = new PresaleTokenOptions(presaleTokenOptions)
    this.includedContracts["presaleToken"] = true
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

module.exports = {
	TokenOptions,
  TokenSaleOptions,
  PresaleOptions,
	WalletOptions,
	Configuration
 }
