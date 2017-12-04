const tokenSaleTemplate = require('./tokenSale.js')
const tokenTemplate = require('./token.js')
const multiSigWallet = require('./multiSigWallet.js')

class TokenSaleTemplate {
  constructor(options) {
    this.text = tokenSaleTemplate(options)
  }
}

class TokenTemplate {
  constructor(options) {
    this.text = tokenTemplate(options)
  }
}
class WalletTemplate {

  constructor(options) {
    this.text = multiSigWallet()
  }
}

module.exports = {
  TokenSaleTemplate,
  TokenTemplate,
  WalletTemplate
}