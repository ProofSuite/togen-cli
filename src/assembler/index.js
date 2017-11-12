const fs = require('fs')
const path = require('path')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const deleteFile = util.promisify(fs.unlink)
const { MultiSigWalletTemplate } = require('../contracts/templates/index.js')
const { Generator } = require('../contracts/generator.js')

//TODO replace process.cwd() by fs.path, __dirname and '/../'
//TODO clean paths and add them to a class ?
//TODO promiseAll instead of sequential awaits
//TODO delete files upon creation of new smart-contracts
//TODO only write files that have been selected in configuration
const assemble = async function(configuration) {
  let generator = new Generator(configuration)

  let includedContracts = configuration.getIncludedContracts()
  includedContracts.forEach(async function(contract) {
    await writeFile(process.cwd() + '/src/contracts/solidity/' + contract.capitalize() + '.sol', generator[contract].text)
  })

  if (configuration.wallet && configuration.wallet.multisig) {
    let multiSigTemplate = new MultiSigWalletTemplate()
    await writeFile(process.cwd() + '/src/contracts/solidity/MultiSigWallet.sol', multiSigTemplate.text)
  }
}

module.exports = {
  assemble
}
