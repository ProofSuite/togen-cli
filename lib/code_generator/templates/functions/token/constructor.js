module.exports = (params) =>
`
function Token() public {
  ${ (params.tokenStandard == 'MINIME') ? `creationBlock = block.number;` : `` }
}
`
