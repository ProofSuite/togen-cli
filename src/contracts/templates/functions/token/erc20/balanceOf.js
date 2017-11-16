module.exports = () =>
`
function balanceOf(address _owner) constant returns (uint256) {
  return balances[_owner];
}
`