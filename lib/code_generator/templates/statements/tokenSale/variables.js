//TODO need to transform it more into some kind of language parser style template
module.exports = (params = {}) => {

let libraries =
`
using SafeMath for uint256;
`

let interfaces =
`
  TokenInterface public token;
`

let contributorDeclaration =
`
  uint256 public contributors;
`

let timeDeclaration  =
`
  uint256 public startTime = ${params.startTime};
  uint256 public endTime = ${params.endTime};
`

let minimumInvestmentDeclaration =
`
  uint256 public minInvestment = ${params.minimumInvestment};
`

let capDeclaration =
`
  uint256 public tokenCap = ${params.cap} * (10 ** 18);
  uint256 public cap = tokenCap / (10 ** 18);
  uint256 public weiCap = cap * price;
`


//TODO need to adapt for uncapped tokensale
// let discountsDeclaration =
// `
// uint256 public firstDiscountPrice = (price * ${params.premium[0]}) / 100;
// uint256 public secondDiscountPrice = (price * ${params.premium[1]}) / 100;
// uint256 public thirdDiscountPrice = (price * ${params.premium[2]}) / 100;

// uint256 public firstDiscountCap = (weiCap * ${params.premiumCaps[0]}) / 100;
// uint256 public secondDiscountCap = (weiCap * ${params.premiumCaps[1]}) / 100;
// uint256 public thirdDiscountCap = (weiCap * ${params.premiumCaps[2]}) / 100;
// `

// ${params.discounted ? discountsDeclaration : `` }

let startDeclaration =
`bool public started = false;`

let common =
`
  uint256 public decimalsMultiplier = (10 ** 18);
  uint256 public totalWeiRaised;
  uint256 public tokensMinted;
  uint256 public totalSupply;

  address public wallet = ${params.wallet};
  uint256 public price = ${params.tokenPrice};
`

let finalizeDeclaration =
`
bool public finalized = false;
`

let variablesDeclaration =
`
  ${libraries}
  ${interfaces}
  ${params.contributors ? contributorDeclaration : `` }
  ${params.finalizeable ? finalizeDeclaration : `` }
  ${params.timed ? timeDeclaration : `` }
  ${params.capped ? capDeclaration : `` }

  ${params.starteable ? startDeclaration : `` }
  ${(params.minimumInvestment && params.minimumInvestment > 0) ? minimumInvestmentDeclaration : `` }
  ${common}
`

return variablesDeclaration


}