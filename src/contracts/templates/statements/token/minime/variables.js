module.exports = (params) =>
`
  using SafeMath for uint256;

  string public name = '${params.name}';
  string public symbol = '${params.symbol}';
  uint8 public decimals = ${params.decimals};

  uint256 public creationBlock;

  bool public mintingFinished = false;
  bool public presaleBalancesLocked = false;

  struct Checkpoint {
    uint128 fromBlock;
    uint128 value;
  }

  Checkpoint[] totalSupplyHistory;
  mapping(address => Checkpoint[]) balances;
  mapping (address => mapping (address => uint)) allowed;
`