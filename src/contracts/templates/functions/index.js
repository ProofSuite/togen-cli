module.exports = {
  token: {
    erc20: {
      balanceOf: require('./token/erc20/balanceOf.js'),
      minting: require('./token/erc20/minting.js'),
      transfers: require('./token/erc20/transfers.js')
    },
    minime: {
      balanceOf: require('./token/minime/balanceOf.js'),
      baseFunctions: require('./token/minime/baseFunctions.js'),
      minting: require('./token/minime/minting.js'),
      totalSupply: require('./token/minime/totalSupply.js'),
      transfers: require('./token/minime/transfers.js')
    },
    constructor: require('./token/constructor.js'),
    fallback: require('./token/fallback.js')
  },
  tokenSale: {
    buyTokens: require('./tokenSale/buyTokens.js'),
    changeController: require('./tokenSale/changeController.js'),
    constructor: require('./tokenSale/constructor.js'),
    fallback: require('./tokenSale/fallback.js'),
    finalize: require('./tokenSale/finalize.js'),
    forwardFunds: require('./tokenSale/forwardFunds.js'),
    tokenBalanceProxy: require('./tokenSale/tokenBalanceProxy.js'),
    tokenSupplyProxy: require('./tokenSale/tokenSupplyProxy.js'),
    validPurchase: require('./tokenSale/validPurchase.js')
  }
}