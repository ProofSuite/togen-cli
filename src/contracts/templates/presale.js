module.exports = (params) => `
pragma solidity ^0.4.11;

import './dependencies/SafeMath.sol';
import './dependencies/Pausable.sol';
import './PresaleToken.sol';


/**
 * @title Presale
 */

contract Presale is Pausable {
  using SafeMath for uint256;


  PresaleToken public token;
  address public wallet;
  uint256 public weiRaised;
  uint256 public cap;
  uint256 public minInvestment;
  uint256 public rate;
  bool public isFinalized;
  string public contactInformation;


  /**
   * event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
  /**
   * event for signaling finished crowdsale
   */
  event Finalized();



  /**
   * crowdsale constructor
   */
  function Presale() {

    token = createTokenContract();
    wallet = ${params.wallet};
    rate = ${params.rate};
    minInvestment = ${params.minInvestment}; //minimum investment in wei
    cap = ${params.cap} * (10 ** 18);
  }

  // creates presale token
  function createTokenContract() internal returns (PresaleToken) {
    return new PresaleToken();

  }

  // fallback function to buy tokens
  function() payable {
    buyTokens(msg.sender);
  }


  /**
   * Low level token purchse function
   * @param beneficiary will recieve the tokens.
   */
  function buyTokens(address beneficiary) payable whenNotPaused {
    require(beneficiary != 0x0);
    require(validPurchase());


    uint256 weiAmount = msg.value;
    weiRaised = weiRaised.add(weiAmount);
    uint256 tokens = weiAmount.mul(rate);

    token.mint(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);
    forwardFunds();
  }

  function forwardFunds() internal {
    wallet.transfer(msg.value);
  }

  function validPurchase() internal constant returns (bool) {

    uint256 weiAmount = weiRaised.add(msg.value);
    bool notSmallAmount = msg.value >= minInvestment;
    bool withinCap = weiAmount.mul(rate) <= cap;

    return (notSmallAmount && withinCap);
  }

  function finalize() onlyOwner {
    require(!isFinalized);
    require(hasEnded());

    token.finishMinting();
    Finalized();

    isFinalized = true;
  }


  function setContactInformation(string info) onlyOwner {
      contactInformation = info;
  }

  function hasEnded() public constant returns (bool) {
    bool capReached = (weiRaised.mul(rate) >= cap);
    return capReached;
  }
}
`