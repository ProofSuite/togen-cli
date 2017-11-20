module.exports = (params) => {
  let computedTokens = ``;

  if (!params.discounted) {
    computedTokens =
    `
    uint256 tokens = weiAmount.mul(decimalsMultiplier).div(price);
    `

  }
  else if (params.discounted) {
    computedTokens =
    `
    uint256 discountedPrice = getPrice();
    uint256 tokens = weiAmount.mul(decimalsMultiplier).div(discountedPrice);
    `
  }

  return computedTokens
}
