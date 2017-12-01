module.exports = (params) =>
`
function ${params.contractName} () public {
  ${ (params.tokenStandard == 'MINIME') ? `creationBlock = block.number;` : `` }
}
`
