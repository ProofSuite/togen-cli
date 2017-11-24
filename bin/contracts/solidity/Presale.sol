
pragma solidity ^0.4.15;


import './dependencies/SafeMath.sol';

import './dependencies/Pausable.sol';
import './dependencies/TokenInterface.sol';


/**
 * @title TokenSale
 */
contract TokenSale is Pausable {

  
  
using SafeMath for uint256;

  
  TokenInterface public token;

  
  
bool public finalized = false;

  
  

  
  
  
  uint256 public decimalsMultiplier = (10 ** 18);
  uint256 public totalWeiRaised;
  uint256 public tokensMinted;
  uint256 public totalSupply;

  address public wallet = ;
  uint256 public price = ;


  
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
  event Finalized();

  
function TokenSale(address _tokenAddress) public {
  require(_tokenAddress != 0x0);
  token = TokenInterface(_tokenAddress);
}

  
  // fallback function to buy tokens
  function() public payable
  {
    buyTokens(msg.sender);
  }

  
  
  /**
   * Low level token purchse function
   * @param beneficiary will recieve the tokens.
   */
  function buyTokens(address beneficiary)
    public
    payable
    whenNotPaused
    whenNotFinalized
  {
    require(beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;
    totalWeiRaised = totalWeiRaised.add(weiAmount);

    
    uint256 tokens = weiAmount.mul(decimalsMultiplier).div(price);
    

    tokensMinted = tokensMinted.add(tokens);
    
    

    token.mint(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);
    forwardFunds();
  }

  
function forwardFunds() internal
{
  wallet.transfer(msg.value);
}

  
  /**
   * Validates the purchase (period, minimum amount, within cap)
   * @return {bool} valid
   */
  function validPurchase() internal constant returns (bool) {
    
    
    
    return true;
  }
  
  
  
  
/**
 * Change the Token controller
 * @param _newController {address} New Token controller
 */
 function changeController(address _newController) onlyOwner public returns (bool) {
   token.transferControl(_newController);
   return true;
 }
 
  
function enableTransfers() public returns (bool) {
  token.enableTransfers(true);
  return true;
}

function lockTransfers() public onlyOwner returns (bool) {
  token.enableTransfers(false);
  return true;
}

  
  
function finalize() public onlyOwner returns (bool) {
  require(paused);

  token.finishMinting();
  Finalized();

  finalized = true;
  return true;
}

modifier whenNotFinalized() {
  require(!finalized);
  _;
}


}
