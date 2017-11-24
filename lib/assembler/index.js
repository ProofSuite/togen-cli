const fs = require('fs-extra')
const path = require('path')
const util = require('util')
const { writeFile, deleteFile, getContractBasename } = require('./../helpers')
const CodeGenerator = require('../code_generator/index.js')
const Options = require('../options/index.js')
const Config = require('../config.js')

let config = new Config()

//TODO promiseAll instead of sequential awaits
//TODO delete files upon creation of new smart-contracts ?
//TODO mix with generator class and possibly call code_generator ?
//TODO reinclude the multisig
const build = async function(options, localPath) {
  let generator = new CodeGenerator(options)
  let includedContracts = options.getIncludedContracts()
  includedContracts.forEach(async function(contract) {
    let baseName = getContractBasename(contract)
    let filePath = path.join(localPath, baseName)
    await writeFile(filePath, generator[contract].text)
  })

  // if (options.wallet && options.wallet.multisig) {
  //   let multiSigTemplate = new MultiSigWalletTemplate()
  //   let filePath = path.join(config.outputFolder, 'MultiSigWallet.sol')
  //   await writeFile(filePath, multiSigTemplate.text)
  // }
}


//TODO refactor
const buildFromJSON = async function(json, localPath) {
  let settings = JSON.parse(json)
  let options = new Options(settings)
  let generator = new CodeGenerator(options)
  let includedContracts = options.getIncludedContracts()

  includedContracts.forEach(async function(contract) {
    let baseName = getContractBasename(contract)
    let filePath = path.join(localPath, baseName)
    await writeFile(filePath, generator[contract].text)
  })
}

const buildContract = async function(contract) {
  let baseName = getContractBasename(contract)
  let localPath = config.localContractsDir
  let filePath = path.join(localPath, baseName)
  await writeFile(filePath, generator[contract].text)
}

const print = async function(json) {
  let settings = JSON.parse(json)
  let options = new Options(settings)
  let generator = new CodeGenerator(options)
  let includedContracts = options.getIncludedContracts()
  console.log(options)
  console.log(includedContracts)
  includedContracts.forEach(async function(contract) {

    console.log("*********************")
    console.log(generator[contract].text)
    console.log("*********************")
  })
}

module.exports = {
  build,
  buildFromJSON,
  buildContract,
  print
}
