let {
  TokenSaleTemplate,
  TokenTemplate
} = require('./templates/index.js')

class Generator {
  constructor(configuration) {
    if (configuration.presaleToken) this.generatePresaleToken(configuration.presaleToken)
    if (configuration.token) this.generateToken(configuration.token)
    if (configuration.tokenSale) this.generateTokenSale(configuration.tokenSale)
    if (configuration.presale) this.generatePresale(configuration.presale)
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
}

module.exports = Generator
