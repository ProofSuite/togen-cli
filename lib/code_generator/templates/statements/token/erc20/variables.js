module.exports = (params) =>
`
  using SafeMath for uint256;
  mapping(address => uint) balances;
  mapping (address => mapping (address => uint)) allowed;

  string public constant name = '${params.name}';
  string public constant symbol = '${params.symbol}';
  uint8 public constant decimals = ${params.decimals};
  bool public mintingFinished = false;

  ${ (params.tokenStandard == 'MINIME') ? `uin256 public creationBlock;` : `` }
`