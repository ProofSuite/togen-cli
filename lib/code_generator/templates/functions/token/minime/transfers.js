module.exports = () => `
/**
* Standard ERC20 transfer tokens function
* @param _to {address}
* @param _amount {uint}
* @return success {bool}
*/
function transfer(address _to, uint256 _amount) public returns (bool success) {
  return doTransfer(msg.sender, _to, _amount);
}

/**
* Standard ERC20 transferFrom function
* @param _from {address}
* @param _to {address}
* @param _amount {uint256}
* @return success {bool}
*/
function transferFrom(address _from, address _to, uint256 _amount) public returns (bool success) {
  require(allowed[_from][msg.sender] >= _amount);
  allowed[_from][msg.sender] -= _amount;
  return doTransfer(_from, _to, _amount);
}

/**
* Standard ERC20 approve function
* @param _spender {address}
* @param _amount {uint256}
* @return success {bool}
*/
function approve(address _spender, uint256 _amount) public returns (bool success) {

  //https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
  require((_amount == 0) || (allowed[msg.sender][_spender] == 0));

  allowed[msg.sender][_spender] = _amount;
  Approval(msg.sender, _spender, _amount);
  return true;
}

/**
* Standard ERC20 approve function
* @param _spender {address}
* @param _amount {uint256}
* @return success {bool}
*/
function approveAndCall(address _spender, uint256 _amount, bytes _extraData) public returns (bool success) {
  approve(_spender, _amount);

  ApproveAndCallReceiver(_spender).receiveApproval(
      msg.sender,
      _amount,
      this,
      _extraData
  );

  return true;
}

/**
* Standard ERC20 allowance function
* @param _owner {address}
* @param _spender {address}
* @return remaining {uint256}
 */
function allowance(address _owner, address _spender) public constant returns (uint256 remaining) {
  return allowed[_owner][_spender];
}

/**
* Internal Transfer function - Updates the checkpoint ledger
* @param _from {address}
* @param _to {address}
* @param _amount {uint256}
* @return success {bool}
*/
function doTransfer(address _from, address _to, uint256 _amount) internal returns(bool) {
  require(_amount > 0);
  require((_to != 0) && (_to != address(this)));

  // If the amount being transfered is more than the balance of the
  // account the transfer returns false
  uint256 previousBalanceFrom = balanceOfAt(_from, block.number);
  require(previousBalanceFrom >= _amount);

  // First update the balance array with the new value for the address
  //  sending the tokens
  updateValueAtNow(balances[_from], previousBalanceFrom - _amount);

  // Then update the balance array with the new value for the address
  //  receiving the tokens
  uint256 previousBalanceTo = balanceOfAt(_to, block.number);
  require(previousBalanceTo + _amount >= previousBalanceTo); // Check for overflow
  updateValueAtNow(balances[_to], previousBalanceTo + _amount);

  // An event to make the transfer easy to find on the blockchain
  Transfer(_from, _to, _amount);
  return true;
}
`