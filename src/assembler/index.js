const fs = require('fs')
const path = require('path')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const deleteFile = util.promisify(fs.unlink)
const { MultiSigWalletTemplate } = require('../contracts/templates/index.js')
const { Generator } = require('../contracts/generator.js')

//TODO replace process.cwd() by fs.path, __dirname and '/../'
//TODO clean paths and add them to a class ?
//TODO clean arguments - JSON or named parameters
//TODO promiseAll instead of sequential awaits
//TODO delete files upon creation of new smart-contracts
//TODO only write files that have been selected in configuration
const assemble = async function(configuration) {
  let generator = new Generator(configuration)

  let contracts = Object.keys(configuration.includedContracts)

  contracts.forEach(async function(contract) {
    if (configuration.includedContracts[contract]) {
      await writeFile(process.cwd() + '/src/contracts/solidity/' + contract + '.sol', generator[contract].text)
    }
  })

  if (configuration.wallet && configuration.wallet.multisig) {
    let multiSigTemplate = new MultiSigWalletTemplate()
    await writeFile(process.cwd() + '/src/contracts/solidity/MultiSigWallet.sol', multiSigTemplate.text)
  }


  // if (configuration.token) {
  //   await writeFile(process.cwd() + '/src/contracts/solidity/Token.sol', generator.token.text)
  // }

  // if (configuration.tokenSale) {
  //   await writeFile(process.cwd() + '/src/contracts/solidity/TokenSale.sol', generator.tokenSale.text)
  // }

  // if (configuration.presale) {
  //   await writeFile(process.cwd() + '/src/contracts/solidity/Presale.sol', generator.presale.text)
  // }

  // if (configuration.presaleToken) {
  //   await writeFile(process.cwd() + '/src/contracts/solidity/PresaleToken.sol', generator.presaleToken.text)
  // }

  // if (configuration.wallet && configuration.wallet.multisig) {
  //   let multiSigTemplate = new MultiSigWalletTemplate()
  //   await writeFile(process.cwd() + '/src/contracts/solidity/MultiSigWallet.sol', multiSigTemplate.text)
  // }
}

module.exports = {
  assemble
}
