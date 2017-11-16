module.exports = (params = {}) => {
  let minimumInvestmentCondition = ``;
  let timeCondition = ``;

  if (params.minInvestment && params.minInvestment > 0) {
    let minimumInvestmentCondition = `require(msg.value >= ${params.minInvestment});`
  } else {
    let minimumInvestmentCondition = `require(msg.value != 0);`
  }


  //TODO include conditions within the statement folder ?
  //TODO have to check for started condition
  if (params.startDate && params.endDate) {
    timeCondition = `
    uint256 current = now;
    require(current >= ${params.startDate} || started);
    require(current <= ${params.endDate});
    `
  }

  let body = `
  function validPurchase() internal constant returns (bool) {
    ${minimumInvestmentCondition}
    ${timeCondition}
    return true;
  }
  `

  return body;
}