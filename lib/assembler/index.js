const fs = require('fs')
const path = require('path')
const util = require('util')
const { writeFile, deleteFile, getContractBaseName } = require('./../helpers')
const Generator = require('../code_generator/index.js')
const Config = require('./../config.js')


//TODO promiseAll instead of sequential awaits
//TODO delete files upon creation of new smart-contracts

const build = async function(options, config) {
  let generator = new Generator(options)

  let includedContracts = options.getIncludedContracts()
  includedContracts.forEach(async function(contract) {
    let baseName = getContractBasename(contract)
    let filePath = path.join(config.outputFolder, baseName)
    await writeFile(filePath, generator[contract].text)
  })

  // if (options.wallet && options.wallet.multisig) {
  //   let multiSigTemplate = new MultiSigWalletTemplate()
  //   let filePath = path.join(config.outputFolder, 'MultiSigWallet.sol')
  //   await writeFile(filePath, multiSigTemplate.text)
  // }
}

module.exports = {
  build
}
