let functions = require('./functions');
let statements = require('./statements');
let imports = require('./imports');
let parentContracts = require('./parentContracts')

module.exports = (params = {}) =>
`
pragma solidity ^0.4.15;

${imports(params.imports)}

/**
 * @title ${params.contractName}
 */
contract ${params.contractName} is ${parentContracts(params.parentContracts)} {

  ${statements.tokenSale.variables(params)}
  ${statements.tokenSale.events()}
  ${functions.tokenSale.constructor()}
  ${functions.tokenSale.fallback()}
  ${params.discounted ? functions.tokenSale.getPrice() : `` }
  ${functions.tokenSale.buyTokens(params)}
  ${functions.tokenSale.forwardFunds()}
  ${functions.tokenSale.validPurchase(params)}
  ${params.proxy ? functions.tokenSale.tokenSupplyProxy(params) : `` }
  ${params.proxy ? functions.tokenSale.tokenBalanceProxy(params) : `` }
  ${params.allowControllerTransfer ? functions.tokenSale.changeController() : `` }
  ${params.lockableTransfers ? functions.tokenSale.lockTransfers() : `` }
  ${params.starteable ? functions.tokenSale.forceStart() : `` }
  ${params.finalizeable ? functions.tokenSale.finalize() : `` }

}
`