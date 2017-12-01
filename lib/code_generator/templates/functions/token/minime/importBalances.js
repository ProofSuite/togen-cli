module.exports = () =>
`
/**
 * Import presale balances before the start of the token sale. After importing
 * balances, lockPresaleBalances() has to be called to prevent further modification
 * of presale balances.
 * @param _addresses {address[]} Array of presale addresses
 * @param _balances {uint256[]} Array of balances corresponding to presale addresses.
 * @return success {bool}
 */
function importPresaleBalances(address[] _addresses, uint256[] _balances) public onlyController returns (bool) {
  require(presaleBalancesLocked == false);

  for (uint256 i = 0; i < _addresses.length; i++) {
    updateValueAtNow(balances[_addresses[i]], _balances[i]);
    Transfer(0, _addresses[i], _balances[i]);
  }

  updateValueAtNow(totalSupplyHistory, TOTAL_PRESALE_TOKENS);
  return true;
}

/**
 * Lock presale balances after successful presale balance import
 * @return A boolean that indicates if the operation was successful.
 */
function lockPresaleBalances() public onlyController returns (bool) {
  presaleBalancesLocked = true;
  return true;
}
`