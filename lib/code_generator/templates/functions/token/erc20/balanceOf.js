module.exports = () =>
`
function balanceOf(address _owner) public constant returns (uint256) {
  return balances[_owner];
}
`