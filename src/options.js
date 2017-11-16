require('./utils.js')
let h = require('./helpers.js')
let validator = require('./validators.js')

//TODO rename as parameters
class TokenOptions {

	constructor(parameters) {

    this.decimals = parameters.decimals;
    this.symbol = parameters.symbol;
    this.name = parameters.name;

    if (parameters.contractName) {
      this.contractName = parameters.contractName
    } else if (parameters.name) {
      this.contractName = this.name.camelize().capitalize()
    }

  }

  //TODO refactor function when adding other type of token
  setTokenType(type) {
    if (!validator.isValidTokenType(type)) {
      this.type = type
    }
  }

  //TODO refactor to an array structure
  //TODO include the parentContracts variable in the TokenOptions without displaying it in the configuration
  resolveImports() {
    let imports = {}

    imports.safeMath = true

    if (this.type == 'ERC20') {
      imports.ERC20 = true
      imports.Ownable = true
    }
    else if (this.type == 'MINIME') {
      imports.approveCall = true
      imports.controllable = true
      imports.tokenInterface = true
    }

    return imports

  }

  //TODO refactor to an array structure
  //TODO include the parentContracts variable in the TokenOptions
  resolveParentContracts() {
    let parentContracts = {}

    if (this.type == 'ERC20') {
      parentContracts.ERC20 = true
      parentContracts.Ownable = true
    } else if (this.type == 'MINIME') {
      parentContracts.Controllable = true
    }

    return parentContracts
  }

  isComplete() {
    try {
      if (!validator.isValidDecimals(this.decimals)) {
        return false
      } else if (!validator.isValidSymbol(this.symbol)) {
        return false
      } else if (!validator.isValidName(this.name)) {
        return false
      } else if (!validator.isTokenType(this.type)) {
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

	constructor(parameters, isPresale = 'false') {

    this.capped = parameters.capped;
		this.cap = parameters.cap;
		this.tokenPrice = parameters.tokenPrice;
		this.startTime = h.toTimestamp(parameters.startTime);
		this.endTime = h.toTimestamp(parameters.endTime);
    this.wallet = parameters.wallet;
    this.isPresale = parameters.isPresale


    this.proxyBalanceOf = parameters.proxyBalanceOf;
    this.proxyTotalSupply = parameters.proxyTotalSupply;
    this.contributors = parameters.contributors
    this.minimumInvestment = parameters.minimumInvestment;
    this.updateableController = parameters.updateableController
  }

  //TODO complete this validation
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

  //TODO refactor to an array structure
  //TODO include the parentContracts variable in the TokenOptions without displaying it in the configuration
  //TODO personalize depending on the options
  resolveImports() {
    return {SafeMath: true, Pausable: true, TokenInterface: true}
  }

  //TODO refactor to an array structure
  //TODO include the parentContracts variable in the TokenOptions
  //TODO personalize depending on the options
  resolveParentContracts() {
    return { Pausable: true }
  }
}


class WalletOptions {

	constructor(options) {
    this.isMultiSig = options.isMultiSig;
  }

  isComplete() {
    return (typeof(this.multisig) === "boolean")
  }

}

module.exports = {
	TokenOptions,
  TokenSaleOptions,
	WalletOptions
 }
