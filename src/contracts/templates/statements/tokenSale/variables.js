//TODO need to transform it more into some kind of language parser style template
module.exports = (params = {}) => {

let libraries = `
using SafeMath for uint256;
`

let interfaces = `
PresaleToken public token;
`

let contributorDeclaration = `
uint256 public contributors;
`

let timeDeclaration  =
`
uint256 public startTime = ${params.startTime};
uint256 public endTime = ${params.endTime};
`

let minInvestmentDeclaration =
`
uint256 public minInvestment = ${params.minimumInvestment};
`

let capDeclaration =
`
uint256 public tokenCap = ${params.cap} * (10 ** 18);
uint256 public cap = tokenCap / (10 ** 18);
uint256 public weiCap = cap * priceInWei;
`

let common =
`
uint256 public decimalsMultiplier = (10 ** 18);
uint256 public totalWeiRaised;
uint256 public tokensMinted;
uint256 public totalSupply;
bool public started = false;
bool public finalized = false;
address public wallet = ${params.wallet};
uint256 public priceInWei = ${params.tokenPrice};
`

return `
  ${libraries}
  ${interfaces}
  ${params.contributors ? contributorDeclaration : `` }
  ${params.timed ? timeDeclaration : `` }
  ${params.capped ? capDeclaration : `` }
  ${(params.minimumInvestment && params.minimumInvestment > 0) ? minimumInvestmentDeclaration : `` }
  ${common}
`

}