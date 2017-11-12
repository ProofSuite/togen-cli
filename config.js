const path = require('path')
const workingDirectory = process.cwd()
//TODO standardize paths for windows, mac, linux
//TODO turn all the paths into absolute paths by join with process.cwd()
const config = {
  workingDirectory: workingDirectory,
  contractsFolder: './src/assembler/contracts/',
  contractConfiguration: './src/contracts/configuration.json',
  flattenedContractsOutput: './src/contracts/solidity/flattened_contracts',
  templatesFolder: './src/contracts/templates/',
  outputFolder: path.join(workingDirectory, './src/contracts/solidity/'),
  compilerOutputFolder: path.join(workingDirectory, './src/contracts/output'),
}

module.exports = config