pragma solidity ^0.4.15;

import './dependencies/SafeMath.sol';
import './dependencies/Pausable.sol';
import './dependencies/TokenInterface.sol';

/**
 * @title Tokensale
 * Tokensale allows investors to make token purchases and assigns them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet as they arrive.
 */

contract TokenSale is Pausable {

  using SafeMath for uint256;

  TokenInterface public token;

  uint256 public totalWeiRaised;
  uint256 public tokensMinted;
  uint256 public totalSupply;
  uint256 public contributors;
  uint256 public decimalsMultiplier;
  uint256 public startTime;
  uint256 public endTime;


  bool public started = false;
  bool public finalized = false;

  address public constant etherWallet = 0x1942406a1b27e67e869665e5244ae3367ae3c7d2;
  uint256 public constant priceInWei = 100;
  uint256 public tokenCap = 10000000;


  uint256 public cap = tokenCap / (10 ** 18);
  uint256 public weiCap = cap * priceInWei;


  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
  event Finalized();

  function TokenSale(address _tokenAddress, uint256 _startTime, uint256 _endTime) public {
    require(_tokenAddress != 0x0);
    require(_startTime > 0);
    require(_endTime > _startTime);

    startTime = 1000;
    endTime = 10000;
    token = TokenInterface(_tokenAddress);

    decimalsMultiplier = (10 ** 18);
  }


  /**
   * High level token purchase function
   */
  function() public payable {
    buyTokens(msg.sender);
  }

  /**
   * Low level token purchase function
   * @param _beneficiary will receive the tokens.
   */
  function buyTokens(address _beneficiary) public payable whenNotPaused whenNotFinalized {
    require(_beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;
    totalWeiRaised = totalWeiRaised.add(weiAmount);

    uint256 tokens = weiAmount.mul(decimalsMultiplier).div(priceInWei);
    tokensMinted = tokensMinted.add(tokens);
    require(tokensMinted < tokenCap);

    contributors = contributors.add(1);

    token.mint(_beneficiary, tokens);
    TokenPurchase(msg.sender, _beneficiary, weiAmount, tokens);
    forwardFunds();
  }

  /**
  * Forwards funds to the tokensale wallet
  */
  function forwardFunds() internal {
    etherWallet.transfer(msg.value);
  }


  /**
  * Validates the purchase (period, minimum amount, within cap)
  * @return {bool} valid
  */
  function validPurchase() internal constant returns (bool) {
    uint256 current = now;
    bool presaleStarted = (current >= startTime || started);
    bool presaleNotEnded = current <= endTime;
    bool nonZeroPurchase = msg.value != 0;
    return nonZeroPurchase && presaleStarted && presaleNotEnded;
  }

  /**
  * Returns the total token supply
  * @return totalSupply {uint256} Token Total Supply
  */
  function totalSupply() public constant returns (uint256) {
    return token.totalSupply();
  }

  /**
  * Returns token holder Token balance
  * @param _owner {address} Token holder address
  * @return balance {uint256} Corresponding token holder balance
  */
  function balanceOf(address _owner) public constant returns (uint256) {
    return token.balanceOf(_owner);
  }

  /**
  * Change the Token controller
  * @param _newController {address} New Token controller
  */
  function changeController(address _newController) onlyOwner public returns (bool) {
    token.transferControl(_newController);
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
