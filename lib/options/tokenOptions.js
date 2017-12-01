require('../utils.js')

const command = require('inquirer')

const questions = require('../questions')
let h = require('../helpers.js')
let validator = require('../validators/index.js')

class TokenOptions {

    constructor(parameters = {}, type) {
      this.setName(parameters.name)
      this.setSymbol(parameters.symbol)
      this.setDecimals(parameters.decimals)
      this.setLockableTransfers(parameters.lockableTransfers)
      this.setAllowTransfers(parameters.allowTransfers)
      this.setTransferableController(parameters.transferableController)
      this.setTokenStandard(parameters.tokenStandard)
      this.setContractName(type)
    }

    setDecimals(value) {
      this.decimals = value || 18
    }

    setSymbol(value) {
      this.symbol = value || ''
    }

    setName(value) {
      this.name = value || ''
      if (value) {
        this.contractName = value.camelize().capitalize()
      } else {
        this.contractName = ''
      }
    }

    setLockableTransfers(value) {
      this.lockableTransfers = value || false
    }

    setAllowTransfers(value) {
      this.allowTransfers = value || true
    }

    setTransferableController(value) {
      this.transferableController || true
    }

    setTokenStandard(tokenStandard) {
      this.tokenStandard = tokenStandard || 'ERC20'
    }

    setContractName(type) {
      if (type == "PRESALE") {
        this.contractName = "PresaleToken"
      } else if (type == "TOKENSALE") {
        this.contractName = "Token"
      }
    }

    async updateBasicOptions() {
      let { name, symbol, decimals } = await command.prompt(questions.token)
      this.setName(name)
      this.setSymbol(symbol)
      this.setDecimals(decimals)
    }

    async updateTokenStandard() {
      let { choice } = await command.prompt(questions.tokenType)
      this.setTokenStandard(choice)
    }

    async updateAdvancedOptions() {
      let options = await command.prompt(questions.tokenAdvancedConfiguration)

      if (options.advancedSettings == 'Default') {
        this.setAllowTransfers(true)
        this.setLockableTransfers(false)
      } else {
        this.setAllowTransfers(options.allowTransfers)
        this.setLockableTransfers(options.lockableTransfers)
      }
    }


    //TODO refactor to an array structure
    //TODO include the parentContracts variable in the TokenOptions without displaying it in the configuration
    resolveImports() {
      let imports = {}
      imports.safeMath = true

      if (this.tokenStandard == 'ERC20') {
        imports.ERC20 = true
        imports.ownable = true
      }
      else if (this.tokenStandard == 'MINIME') {
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

      if (this.tokenStandard == 'ERC20') {
        parentContracts.ERC20 = true
        parentContracts.Ownable = true
      } else if (this.tokenStandard == 'MINIME') {
        parentContracts.Controllable = true
      }
      return parentContracts
    }


    verifySettings() {
      console.assert(validator.isValidDecimals(this.decimals))
      console.assert(validator.isValidSymbol(this.symbol))
      console.assert(validator.isValidName(this.name))
      console.assert(validator.isValidTokenStandard(this.tokenStandard))
      console.assert(validator.isBoolean(this.lockableTransfers))

      return true
    }

  }

  module.exports = TokenOptions