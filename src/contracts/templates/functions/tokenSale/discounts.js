module.exports =
`
/**
 * Get the price in wei for current premium
 * @return price {uint256}
 */
function computePrice() constant public returns (uint256) {

  uint256 price;

  if (totalWeiRaised < firstDiscountCap) {
    price = firstDiscountPrice;
  } else if (totalWeiRaised < secondDiscountCap) {
    price = secondDiscountPrice;
  } else if (totalWeiRaised < thirdDiscountCap) {
    price = thirdDiscountPrice;
  } else {
    price = BASE_PRICE_IN_WEI;
  }

  return price;
}
`