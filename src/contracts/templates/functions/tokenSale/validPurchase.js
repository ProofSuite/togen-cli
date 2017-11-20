module.exports = (params = {}) => {
  let minimumInvestmentCondition = ``;
  let timeCondition = ``;
  let forceStartCondition = ``;

  if (params.minimumInvestment && params.minimumInvestment > 0) {
    let minimumInvestmentCondition = `require(msg.value >= ${params.minimumInvestment});`
  } else {
    let minimumInvestmentCondition = `require(msg.value != 0);`
  }


  //TODO include conditions within the statement folder ?
  //TODO have to check for started condition
  if (params.startTime && params.endTime) {
    timeCondition =
    `
    uint256 current = now;
    require(current >= startTime);
    require(current <= endTime);
    `
  }

  if (params.forceStarteable) {
    forceStartCondition =
    `
    require(started);
    `
  }

  let body =
  `
  /**
   * Validates the purchase (period, minimum amount, within cap)
   * @return {bool} valid
   */
  function validPurchase() internal constant returns (bool) {
    ${forceStartCondition}
    ${minimumInvestmentCondition}
    ${timeCondition}
    return true;
  }
  `

  return body;
}