module.exports = () =>
`
  event Mint(address indexed to, uint256 amount);
  event MintFinished();
  event Approval(address indexed _owner, address indexed _spender, uint256 _amount);
  event Transfer(address indexed from, address indexed to, uint256 value);
`