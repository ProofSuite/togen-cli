//TODO might need to make two different templates for minime and erc20

let functions = require('./functions')
let statements = require('./statements')
let imports = require('./imports')
let parentContracts = require('./parentContracts')

module.exports = (params = {}) =>
`
pragma solidity ^0.4.15;

${imports(params.imports)}

/**
 * @title ${params.contractName}
 */
contract ${params.contractName} is ${parentContracts(params.parentContracts)} {

  ${ (params.type == 'MINIME') ? statements.token.minime.variables(params) : statements.token.erc20.variables(params)}
  ${ statements.token.events() }
  ${ functions.token.constructor() }
  ${ functions.token.fallback() }

  ${ (params.type == 'MINIME') ? functions.token.minime.totalSupply() : `` }
  ${ (params.type == 'MINIME') ? functions.token.minime.balanceOf() : functions.token.erc20.balanceOf()}
  ${ (params.type == 'MINIME') ? functions.token.minime.transfers() : functions.token.erc20.transfers()}
  ${ (params.type == 'MINIME') ? functions.token.minime.minting() : functions.token.erc20.minting()}
  ${ (params.type == 'MINIME') ? functions.token.minime.baseFunctions() : `` }

}
`