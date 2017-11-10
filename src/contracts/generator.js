
let {
  TokenSaleTemplate,
  TokenTemplate,
  PresaleTokenTemplate,
  PresaleTemplate
} = require('./templates/index.js')

//TODO move the template classes to another file and import them in the generator.js file
class Generator {
  constructor(configuration) {
    if (configuration.token) this.generateToken(configuration.token)
    if (configuration.tokenSale) this.generateTokenSale(configuration.tokenSale)
    if (configuration.presale) this.generatePresale(configuration.presale)
    if (configuration.presaleToken) this.generatePresaleToken(configuration.presaleToken)
  }

  generateTokenSale(options) {
    this.tokenSale = new TokenSaleTemplate(options)
  }

  generateToken(options) {
    this.token = new TokenTemplate(options)
  }

  generatePresaleToken(options) {
    this.presaleToken = new PresaleTokenTemplate(options)
  }

  generatePresale(options) {
    this.presale = new PresaleTemplate(options)
  }

}

module.exports = {
  Generator
}
