module.exports = () =>
`
/**
 * Function to mint tokens
 * @param _to The address that will recieve the minted tokens.
 * @param _amount The amount of tokens to mint.
 * @return A boolean that indicates if the operation was successful.
 */
function mint(address _to, uint256 _amount) public onlyOwner canMint returns (bool) {
  totalSupply = totalSupply.add(_amount);
  balances[_to] = balances[_to].add(_amount);
  Mint(_to, _amount);
  return true;
}

/**
 * Function to stop minting new tokens.
 * @return True if the operation was successful.
 */
function finishMinting() public onlyOwner returns (bool) {
  mintingFinished = true;
  MintFinished();
  return true;
}

modifier canMint() {
  require(!mintingFinished);
  _;
}
`