module.exports = () =>
`
/**
 * Get the price in wei for current premium
 * @return price {uint256}
 */
function getPrice() constant public returns (uint256) {
  uint256 result;

  if (totalWeiRaised < firstDiscountCap) {
    result = firstDiscountPrice;
  } else if (totalWeiRaised < secondDiscountCap) {
    result = secondDiscountPrice;
  } else if (totalWeiRaised < thirdDiscountCap) {
    result = thirdDiscountPrice;
  } else {
    result = price;
  }

  return result;
}
`