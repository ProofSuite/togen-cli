module.exports = () => `
/**
* Token creation functions - can only be called by the tokensale controller during the tokensale period
* @param _owner {address}
* @param _amount {uint256}
* @return success {bool}
*/
function mint(address _owner, uint256 _amount) public onlyController canMint returns (bool) {
  uint256 curTotalSupply = totalSupply();
  uint256 previousBalanceTo = balanceOf(_owner);

  require(curTotalSupply + _amount >= curTotalSupply); // Check for overflow
  require(previousBalanceTo + _amount >= previousBalanceTo); // Check for overflow

  updateValueAtNow(totalSupplyHistory, curTotalSupply + _amount);
  updateValueAtNow(balances[_owner], previousBalanceTo + _amount);
  Transfer(0, _owner, _amount);
  return true;
}

modifier canMint() {
  require(!mintingFinished);
  _;
}

/**
 * Lock the minting of tokens - to be called after the presale
 * @return {bool} success
*/
function finishMinting() public onlyController returns (bool) {
  mintingFinished = true;
  MintFinished();
  return true;
}
`