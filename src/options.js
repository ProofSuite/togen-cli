require('./utils.js')
let h = require('./helpers.js')
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

module.exports = {
	TokenOptions,
  TokenSaleOptions,
  PresaleOptions,
	WalletOptions
 }
