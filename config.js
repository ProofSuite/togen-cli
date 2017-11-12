//TODO standardize paths for windows, mac, linux
const config = {
  workingDirectory: process.cwd(),
  contractsFolder: './src/assembler/contracts/',
  contractConfiguration: './src/contracts/configuration.json',
  flattenedContractsOutput: './src/contracts/solidity/flattened_contracts',
  templatesFolder: './src/contracts/templates/',
  outputFolder: './src/contracts/solidity/',
  compilerOutputFolder: './src/contracts/output',
}

module.exports = config