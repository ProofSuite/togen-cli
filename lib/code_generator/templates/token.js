//TODO might need to make two different templates for minime and erc20

let functions = require('./functions')
let statements = require('./statements')
let imports = require('./imports')
let parentContracts = require('./parentContracts')

module.exports = (params = {}) =>
`
pragma solidity ^0.4.18;

${imports(params.imports)}

/**
 * @title ${params.contractName}
 */
contract Token is ${parentContracts(params.parentContracts)} {

  ${ (params.tokenStandard == 'MINIME') ? statements.token.minime.variables(params) : statements.token.erc20.variables(params)}
  ${ statements.token.events() }
  ${ functions.token.constructor(params) }
  ${ functions.token.fallback() }

  ${ (params.tokenStandard == 'MINIME') ? functions.token.minime.totalSupply() : `` }
  ${ (params.tokenStandard == 'MINIME') ? functions.token.minime.balanceOf() : functions.token.erc20.balanceOf()}
  ${ (params.tokenStandard == 'MINIME') ? functions.token.minime.transfers() : functions.token.erc20.transfers()}
  ${ (params.tokenStandard == 'MINIME') ? functions.token.minime.minting() : functions.token.erc20.minting()}
  ${ (params.tokenStandard == 'MINIME') ? functions.token.minime.baseFunctions() : `` }

}
`