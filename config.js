//TODO standardize paths for windows, mac, linux
const config = {
  contractsFolder: './src/assembler/contracts/',
  templatesFolder: './src/contracts/templates/',
  outputFolder: './src/contracts/solidity/',
  compilerOutputFolder: './src/contracts/output'
}


const testContractConfiguration = {
  contracts: ['token', 'tokenSale', 'presaleToken', 'presale', 'wallet'],
  token: {
    decimals: 18,
    symbol: 'DVE',
    name: 'David'
  },
  tokenSale: {
    cap: 1000000,
    tokenPrice: 1000,
    startDate: 1510297597,
    endDate: 1512889598,
    etherWallet: '0xDf08F82De32B8d460adbE8D72043E3a7e25A3B39'
  },
  presaleToken: {
    decimals: 18,
    symbol: 'DVEP',
    name: 'DavidP'
  },
  presale: {
    wallet: '0xDf08F82De32B8d460adbE8D72043E3a7e25A3B39',
    rate: 1000,
    minInvestment: 100,
    cap: 100000
  },
  wallet: {
    multisig: false
  }
}

module.exports = { config, testContractConfiguration }