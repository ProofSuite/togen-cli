let {
  TokenSaleTemplate,
  TokenTemplate
} = require('./templates/index.js')

class CodeGenerator {
  constructor(options) {
    if (options.presaleToken) this.generatePresaleToken(options.presaleToken)
    if (options.token) this.generateToken(options.token)
    if (options.tokenSale) this.generateTokenSale(options.tokenSale)
    if (options.presale) this.generatePresale(options.presale)
    if (options.wallet) this.generateWallet(options.wallet)
  }

  //TODO refactor imports and parentClasses, perhaps call them directly in the template file ?
  generateTokenSale(parameters) {
    parameters.imports = parameters.resolveImports();
    parameters.parentContracts = parameters.resolveParentContracts();
    this.tokenSale = new TokenSaleTemplate(parameters)
  }

  generateToken(parameters) {
    parameters.imports = parameters.resolveImports();
    parameters.parentContracts = parameters.resolveParentContracts();
    this.token = new TokenTemplate(parameters)
  }

  generatePresaleToken(parameters) {
    parameters.imports = parameters.resolveImports();
    parameters.parentContracts = parameters.resolveParentContracts();
    this.presaleToken = new TokenTemplate(parameters)
  }

  generatePresale(parameters) {
    parameters.imports = parameters.resolveImports();
    parameters.parentContracts = parameters.resolveParentContracts();
    this.presale = new TokenSaleTemplate(parameters)
  }

  //TODO reinclude the wallet
  generateWallet(parameters) {
    this.wallet = "parameters"
  }
}

module.exports = CodeGenerator
