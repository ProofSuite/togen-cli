module.exports = {
  token: {
    erc20: {
      variables: require('./token/erc20/variables.js')
    },
    minime: {
      variables: require('./token/minime/variables.js')
    },
    events: require('./token/events.js'),
  },
  tokenSale: {
    variables: require('./tokenSale/variables.js'),
    events: require('./tokenSale/events.js'),
    computeTokens: require('./tokenSale/computeTokens.js'),
    addContributor: () => `contributors = contributors.add(1);`,
    requireWithinCap: () => `require(tokensMinted < tokenCap);`
  }
}