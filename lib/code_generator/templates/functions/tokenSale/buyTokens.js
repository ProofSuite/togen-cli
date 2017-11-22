let statements = require('../../statements')

module.exports = (params = {capped: false, contributors: false, finalizeable: true}) =>
`
  /**
   * Low level token purchse function
   * @param beneficiary will recieve the tokens.
   */
  function buyTokens(address beneficiary)
    public
    payable
    whenNotPaused
    ${params.finalizeable ? `whenNotFinalized` : ``}
  {
    require(beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;
    totalWeiRaised = totalWeiRaised.add(weiAmount);

    ${statements.tokenSale.computeTokens(params)}

    tokensMinted = tokensMinted.add(tokens);
    ${params.capped ? statements.tokenSale.requireWithinCap() : ``}
    ${params.contributors ? statements.tokenSale.addContributor() : ``}

    token.mint(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);
    forwardFunds();
  }
`