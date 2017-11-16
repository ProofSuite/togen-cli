module.exports = () =>
`
/**
  * Returns the total token supply at the current block
  * @return total supply {uint256}
  */
  function totalSupply() public constant returns (uint256) {
    return totalSupplyAt(block.number);
  }

  /**
  * Returns the total token supply at the given block number
  * @param _blockNumber {uint256}
  * @return total supply {uint256}
  */
  function totalSupplyAt(uint256 _blockNumber) public constant returns(uint256) {
    // These next few lines are used when the totalSupply of the token is
    //  requested before a check point was ever created for this token
    if ((totalSupplyHistory.length == 0) || (totalSupplyHistory[0].fromBlock > _blockNumber)) {
            return 0;
    } else {
        return getValueAt(totalSupplyHistory, _blockNumber);
    }
  }
  `