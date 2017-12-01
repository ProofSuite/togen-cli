const solc = require('solc')
const Artifactor = require('truffle-artifactor')
const Schema = require('truffle-contract-schema')
const contract = require('truffle-contract')
const fs = require('fs-extra')
const path = require('path')


const PromiseError = require('./errors/PromiseError.js')

const catchify = require('catchify')
const until = catchify.resolve

const { concatenate } = require('./concatenator.js')

let Options = require('./options/index.js')
let Config = require('./config.js')
let Display = require('./display.js')
let CompilerError = require('./errors/CompilerError')
let MissingFileError = require('./errors/MissingFileError')

let config = new Config()
let display = new Display()



//TODO need to clean the imports
let { getContractName,
      getFlattenedContractPath,
      getFlattenedContractPaths,
      getContractPath,
      getContractsPath,
      getContracts,
      getArtifactPath,
      readFile } = require('./helpers.js')


class Compiler {

  constructor(destination) {
    this.destination = destination
    this.artifactor = new Artifactor(config.localArtifactsDir)
  }

  _clean(compiled, filePath) {
    try {
      var contractName = getContractName(filePath)
      var schema = Schema.normalize(compiled.contracts[contractName] || compiled.contracts[":" + contractName])
      return schema
    }

    catch(e) {
      throw new MissingFileError('Could not find file', contractName)
    }
  }

  _compileAndClean(filePath) {
    try {
      let source = fs.readFileSync(filePath, { encoding: 'utf8' })
      let compiled = solc.compile(source, 1)

      if (compiled.errors) return [compiled.errors, null]

      let contractName = getContractName(filePath)
      let cleaned = this._clean(compiled, contractName)
      return [null, cleaned]
    }

    catch(e) {
      throw(e)
    }
  }

  _getContractObject(filePath) {
    try {
      let [errors, compiled] = this._compileAndClean(filePath)

      if (errors) {
        return [errors, null]
      } else {
        let contractName = getContractName(filePath)
        let result = {
          contractName: contractName,
          abi: compiled.abi,
          binary: compiled.bytecode
        }
        return [null, result]
      }
    }

    catch(e) {
      throw(e)
    }
  }

  async getBytecode(contractName) {
    let filePath = getArtifactPath(contractName)
    let [error, bytecode] = await until(this.getBytecodeFromFile(filePath))
    if (error) throw new Error('ERROR', 'could not get bytecode')

    return bytecode
  }

  async getBytecodeFromFile(filePath) {
    let [error, json] = await until(readFile(filePath))
    if (error) throw new Error('FILE_ERROR', 'could not read file')

    return JSON.parse(json).bytecode
  }

  async getABI(contractName) {
    let filePath = getArtifactPath(contractName)
    let [error, abi] = await until(this.getABIFromFile(filePath))
    if (error) throw new Error('ERROR', 'could not get ABI', console.trace())

    return abi
  }

  async getABIFromFile(filePath) {
    let [error, json] = await until(readFile(filePath))
    if (error) throw new Error('FILE_ERROR', 'could not read file', console.trace());

    return JSON.parse(json).abi
  }

  async compile(contractName, params) {
    try {
      let contractPath = getContractPath(contractName)

      var [error, result] = await until(concatenate(contractPath))
      if (error) console.log(error)

      let concatenatedFilePath = getFlattenedContractPath(contractName)
      var [error, contract] = this._getContractObject(concatenatedFilePath)
      if (error) throw new CompilerError('Could not compile', error)

      var [error] = await until(this.artifactor.save(contract))
      if (error) console.log(error)
    }

    catch(e) {
      if (e instanceof MissingFileError) console.log(e.fileName, 'could not be found\n')
      if (e instanceof CompilerError) console.log(e.errors)
      console.log("ERROR LOG:\n", e)
    }
  }

  async compileContracts(contracts, params) {
    let promises = contracts.map(async(contract) => { await this.compile(contract, params)})
    var [error] = await catchify.all(promises)
    if (error) console.log(error)
  }
}

module.exports = Compiler