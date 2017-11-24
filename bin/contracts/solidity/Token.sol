
pragma solidity ^0.4.15;


import './dependencies/SafeMath.sol';
import './dependencies/ERC20.sol';
import './dependencies/Ownable.sol';




/**
 * @title Token
 */
contract Token is ERC20, Ownable {

  
  using SafeMath for uint256;
  mapping(address => uint) balances;
  mapping (address => mapping (address => uint)) allowed;

  string public constant name = '';
  string public constant symbol = '';
  uint8 public constant decimals = 18;
  bool public mintingFinished = false;

  

  
  event Mint(address indexed to, uint256 amount);
  event MintFinished();
  event Approval(address indexed _owner, address indexed _spender, uint256 _amount);
  event Transfer(address indexed from, address indexed to, uint256 value);

  
function Token() public {
  
}

  
  function() public payable
  {
    revert();
  }


  
  
function balanceOf(address _owner) public constant returns (uint256) {
  return balances[_owner];
}

  
function transfer(address _to, uint _value) public returns (bool) {
  balances[msg.sender] = balances[msg.sender].sub(_value);
  balances[_to] = balances[_to].add(_value);

  Transfer(msg.sender, _to, _value);
  return true;
}

function transferFrom(address _from, address _to, uint _value) public returns (bool) {
  var _allowance = allowed[_from][msg.sender];

  balances[_to] = balances[_to].add(_value);
  balances[_from] = balances[_from].sub(_value);
  allowed[_from][msg.sender] = _allowance.sub(_value);

  Transfer(_from, _to, _value);
  return true;
}

function approve(address _spender, uint _value) public returns (bool) {
  allowed[msg.sender][_spender] = _value;
  Approval(msg.sender, _spender, _value);
  return true;
}

function allowance(address _owner, address _spender) public constant returns (uint256) {
  return allowed[_owner][_spender];
}

  
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

  

}
