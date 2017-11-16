module.exports = () => `
/**
* Returns the total token supply
* @return totalSupply {uint256} Token Total Supply
*/
function totalSupply() public constant returns (uint256) {
  return token.totalSupply();
}
`