let h = require('./helpers.js')

class TokenOptions {

	constructor({decimals, symbol, name}) {

		this.decimals = decimals;
		this.symbol = symbol;
		this.name = name;
  }

  isComplete() {
    if (this.decimals && this.symbol && this.name) {
      return true
    } else {
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
    return (this.cap && this.tokenPrice && this.startDate && this.endDate && this.wallet)
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
    return (this.wallet && this.rate && this.minInvestment && this.cap)
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

class Configuration {
	constructor(tokenOptions = {}, tokenSaleOptions = {}, walletOptions = {}, presaleTokenOptions = {}, presaleOptions = {}) {
		this.token = new TokenOptions(tokenOptions)
    this.tokenSale = new TokenSaleOptions(tokenSaleOptions)
    this.presaleToken = new TokenOptions(presaleTokenOptions)
    this.presale = new PresaleOptions(presaleOptions)
		this.wallet = new WalletOptions(walletOptions)
  }

  setToken(tokenOptions = {}) {
    this.token = new TokenOptions(tokenOptions)
  }

  setTokenSale(tokenSaleOptions = {}) {
    this.tokenSale = new TokenSaleOptions(tokenSaleOptions)
  }

  setWallet(walletOptions = {}) {
    this.wallet = new WalletOptions(walletOptions)
  }

  setPresale(presaleOptions = {}) {
    this.presale = new PresaleOptions(presaleOptions)
  }

  setPresaleToken(presaleTokenOptions = {}) {
    this.presaleToken = new PresaleTokenOptions(presaleTokenOptions)
  }

  isValid() {
    if (!this.token.isComplete()) {
      return false, "token configuration is not complete"
    }
    else if (!this.tokenSale.isComplete()) {
      return false, "token sale configuration is not complete"
    }
    else if (!this.wallet.isComplete()) {
      return false, "wallet configuration is not complete"
    }
    else {
      return true
    }
  }

}

module.exports = {
	TokenOptions,
  TokenSaleOptions,
  PresaleOptions,
	WalletOptions,
	Configuration
 }
