module.exports = () =>
`/**
  * Returns the token holder balance at the current block
  * @param _owner {address}
  * @return balance {uint256}
   */
  function balanceOf(address _owner) public constant returns (uint256 balance) {
    return balanceOfAt(_owner, block.number);
  }

  /**
  * Returns the token holder balance the the given block number
  * @param _owner {address}
  * @param _blockNumber {uint256}
  * @return balance {uint256}
  */
  function balanceOfAt(address _owner, uint256 _blockNumber) public constant returns (uint256) {
    // These next few lines are used when the balance of the token is
    //  requested before a check point was ever created for this token
    if ((balances[_owner].length == 0) || (balances[_owner][0].fromBlock > _blockNumber)) {
            return 0;
    } else {
        return getValueAt(balances[_owner], _blockNumber);
    }
  }`
