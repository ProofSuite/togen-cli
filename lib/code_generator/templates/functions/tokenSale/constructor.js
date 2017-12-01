module.exports = (params) => `
function ${params.contractName} (address _tokenAddress) public {
  require(_tokenAddress != 0x0);
  token = TokenInterface(_tokenAddress);
}
`