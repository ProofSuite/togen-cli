const fs = require('fs-extra')
const path = require('path')
const util = require('util')
const { writeFile, deleteFile, getContractBasename } = require('./../helpers')
const CodeGenerator = require('../code_generator/index.js')
const Options = require('../options/index.js')
const Config = require('../config.js')
const Display = require('../display.js')

const AppError = require('../errors/AppError.js')

let config = new Config()
let display = new Display()

const catchify = require('catchify')
const until = catchify.resolve

//TODO promiseAll instead of sequential awaits
//TODO delete files upon creation of new smart-contracts ?
//TODO mix with generator class and possibly call code_generator ?
//TODO reinclude the multisig
const build = async function(options, localPath) {
  let generator = new CodeGenerator(options)
  let includedContracts = options.getIncludedContracts()

  includedContracts.forEach(async function(contract) {
    let code = generator[contract].text
    let baseName = getContractBasename(contract)
    let filePath = path.join(localPath, baseName)

    let [error] = await until(writeFile(filePath, code))
    if (error) throw new Error('Could not write contract file')
  })

  // if (options.wallet && options.wallet.multisig) {
  //   let multiSigTemplate = new MultiSigWalletTemplate()
  //   let filePath = path.join(config.outputFolder, 'MultiSigWallet.sol')
  //   await writeFile(filePath, multiSigTemplate.text)
  // }
}


const buildFromJSON = async function(settings, localPath, flags) {
  let options = new Options(settings)
  let generator = new CodeGenerator(options)
  let includedContracts = options.getIncludedContracts()

  includedContracts.forEach(async function(contract) {
    let code = generator[contract].text
    let baseName = getContractBasename(contract)
    let filePath = path.join(localPath, baseName)

    let [error] = await until(writeFile(filePath, code))
    if (error) console.log(error)

    if (flags.print) display.contractCode(code)
  })
}

const buildFromLocal = async function(localPath, flags = {}) {
  let settings = Options.parseLocalSettings()
  let options = new Options(settings)
  let generator = new CodeGenerator(options)
  let includedContracts = options.getIncludedContracts()

  includedContracts.forEach(async function(contract) {
    let code = generator[contract].text
    let baseName = getContractBaseName(contract)
    let filePath = path.join(localPath, baseName)

    let [error] = await until(writeFile(filePath, code))
    if (error) throw new AppError('FILE ERROR', 'Could not write file')

    if (flags.print) display.contractCode(code)
  })
}

const buildContract = async function(contract, flags = {}) {
  let settings = Options.parseLocalSettings()
  let options = new Options(settings)
  let generator = new CodeGenerator(options)

  let code = generator[contract].text
  if (!code) throw new Error('Could not generate code')

  let baseName = getContractBasename(contract)
  if (!baseName) throw new AppError('APP ERROR', 'Could not find corresponding contract')

  let localPath = config.localContractsDir
  let filePath = path.join(localPath, baseName)

  let [error] = await until(writeFile(filePath, code))
  if (error) throw new AppError('FILE ERROR', 'Could not write file')

  if (flags.print) display.contractCode(code)
}


const buildContracts = async function(settings, contracts, {print, output}) {
  let options = new Options(settings)
  let generator = new CodeGenerator(options)
  let outputPath = output || config.localContractsDir

  let promises = contracts.map(async(contract) => { await generateCode(generator, contract, outputPath, print)})

  var [errors] = await catchify.all(promises)
  if (errors) console.log(errors)
}


generateCode = async function(generator, contract, outputPath, print) {
  let code = generator[contract].text
  if (!code) throw new AppError('GENERATOR ERROR', 'Could not generate code')

  let baseName = getContractBasename(contract)
  if (!baseName) throw new AppError('FILE ERROR', 'Could not find corresponding contract')

  let filePath = path.join(outputPath, baseName)
  let [error] = await until(writeFile(filePath, code))
  if (error) console.log(error)

  if (print) display.contractCode(code)
}

module.exports = {
  build,
  buildFromJSON,
  buildFromLocal,
  buildContracts,
  buildContract
}
