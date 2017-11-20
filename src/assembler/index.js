const fs = require('fs')
const path = require('path')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const deleteFile = util.promisify(fs.unlink)
const format = require('js-beautify').js_beautify
const config = require('../../config.js')
const { MultiSigWalletTemplate } = require('../contracts/templates/index.js')
const Generator = require('../contracts/generator.js')

let { getContractBasename } = require('../helpers.js')

//TODO promiseAll instead of sequential awaits
//TODO delete files upon creation of new smart-contracts
const build = async function(configuration) {
  let generator = new Generator(configuration)

  let includedContracts = configuration.getIncludedContracts()
  includedContracts.forEach(async function(contract) {
    let baseName = getContractBasename(contract)
    let filePath = path.join(config.outputFolder, baseName)
    // let fileContent = format(generator[contract].text)
    await writeFile(filePath, generator[contract].text)
  })

  if (configuration.wallet && configuration.wallet.multisig) {
    let multiSigTemplate = new MultiSigWalletTemplate()
    let filePath = path.join(config.outputFolder, 'MultiSigWallet.sol')
    await writeFile(filePath, multiSigTemplate.text)
  }
}

module.exports = {
  build
}
