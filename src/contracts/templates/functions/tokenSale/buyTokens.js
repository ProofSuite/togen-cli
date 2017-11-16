let statements = require('../../statements')

module.exports = (params = {capped: false, contributors: false}) =>
  `
  /**
   * Low level token purchse function
   * @param beneficiary will recieve the tokens.
   */
  function buyTokens(address beneficiary) payable whenNotPaused whenNotFinalized {
    require(beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;
    totalWeiRaised = totalWeiRaised.add(weiAmount);

    uint256 tokens = weiAmount.mul(decimalsMultiplier).div(priceInWei);

    tokensMinted = tokensMinted.add(tokens)
    ${params.capped ? statements.requireWithinCap() : ``}
    ${params.contributors ? statements.addContributor() : ``}

    token.mint(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);
    forwardFunds();
  }`