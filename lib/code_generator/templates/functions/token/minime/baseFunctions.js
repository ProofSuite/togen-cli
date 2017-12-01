module.exports = () => `
  /**
   * Internal balance method - gets a certain checkpoint value a a certain _block
   * @param _checkpoints {Checkpoint[]} List of checkpoints - supply history or balance history
   * @return value {uint256} Value of _checkpoints at _block
  */
  function getValueAt(Checkpoint[] storage _checkpoints, uint256 _block) constant internal returns (uint256) {

          if (_checkpoints.length == 0)
            return 0;
          // Shortcut for the actual value
          if (_block >= _checkpoints[_checkpoints.length-1].fromBlock)
            return _checkpoints[_checkpoints.length-1].value;
          if (_block < _checkpoints[0].fromBlock)
            return 0;

          // Binary search of the value in the array
          uint256 min = 0;
          uint256 max = _checkpoints.length-1;
          while (max > min) {
              uint256 mid = (max + min + 1) / 2;
              if (_checkpoints[mid].fromBlock<=_block) {
                  min = mid;
              } else {
                  max = mid-1;
              }
          }
          return _checkpoints[min].value;
      }


      /**
      * Internal update method - updates the checkpoint ledger at the current block
      * @param _checkpoints {Checkpoint[]}  List of checkpoints - supply history or balance history
      * @return value {uint256} Value to add to the checkpoints ledger
       */
      function updateValueAtNow(Checkpoint[] storage _checkpoints, uint256 _value) internal {
          if ((_checkpoints.length == 0) || (_checkpoints[_checkpoints.length-1].fromBlock < block.number)) {
                  Checkpoint storage newCheckPoint = _checkpoints[_checkpoints.length++];
                  newCheckPoint.fromBlock = uint128(block.number);
                  newCheckPoint.value = uint128(_value);
              } else {
                  Checkpoint storage oldCheckPoint = _checkpoints[_checkpoints.length-1];
                  oldCheckPoint.value = uint128(_value);
              }
      }

      function min(uint256 a, uint256 b) public pure returns (uint) {
          return a < b ? a : b;
      }
`