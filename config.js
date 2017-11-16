const path = require('path')
const workingDirectory = process.cwd()
//TODO standardize paths for windows, mac, linux
//TODO turn all the paths into absolute paths by join with process.cwd()
const config = {
  workingDirectory: workingDirectory,
  contractConfiguration: './src/contracts/configuration.json',
  flattenedContractsOutput: path.join(workingDirectory, './src/contracts/solidity/flattened_contracts'),
  templatesFolder: './src/contracts/templates/',
  outputFolder: path.join(workingDirectory, './src/contracts/solidity/'),
  artifactsFolder: path.join(workingDirectory, './src/contracts/json')
}

const params = {
  name: 'Proof Token',
  symbol: 'PRFT',
  decimals: 18,
  contractName: 'Proof Token',
  minime: true,
  imports: {
    Controllable: true,
    ApproveCall: true
  }
}

module.exports = config