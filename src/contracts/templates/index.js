const tokenSaleTemplate = require('./tokenSale.js')
const tokenTemplate = require('./token.js')
const presaleTemplate = require('./presale.js')
const presaleTokenTemplate = require('./presaleToken.js')
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

class PresaleTokenTemplate {

  constructor(options) {
    this.text = presaleTokenTemplate(options)
  }
}

class PresaleTemplate {

  constructor(options) {
    this.text = presaleTemplate(options)
  }
}

class MultiSigWalletTemplate {

  constructor(options) {
    this.text = multiSigWallet()
  }
}

module.exports = {
  TokenSaleTemplate,
  TokenTemplate,
  PresaleTemplate,
  PresaleTokenTemplate,
  MultiSigWalletTemplate
}