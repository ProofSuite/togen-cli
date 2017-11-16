let functions = require('./functions');
let statements = require('./statements');
let imports = require('./imports');
let parentContracts = require('./parentContracts')

module.exports = (params = {}) =>
`pragma solidity ^0.4.15;

${imports(params.imports)}

/**
 * @title ${params.contractName}
 */
contract ${params.contractName} is ${parentContracts(params.imports)} {

  ${statements.tokenSale.variables(params)}
  ${statements.tokenSale.events()}
  ${functions.tokenSale.constructor()}
  ${functions.tokenSale.fallback()}
  ${functions.tokenSale.buyTokens(params)}
  ${functions.tokenSale.forwardFunds()}
  ${functions.tokenSale.validPurchase(params)}
  ${params.proxy ? functions.tokenSale.tokenSupplyProxy(params) : `` }
  ${params.proxy ? functions.tokenSale.tokenBalanceProxy(params) : `` }
  ${params.updateableController ? functions.tokenSale.changeController() : `` }
  ${functions.tokenSale.finalize()}

}
`