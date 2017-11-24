const solc = require('solc')
const Artifactor = require('truffle-artifactor')
const Schema = require('truffle-contract-schema')
const contract = require('truffle-contract')
const fs = require('fs-extra')
const path = require('path')
const config = require('./config.js')
const until = require('catchify')
const { concatenate } = require('./concatenator.js')



//TODO need to clean the imports
let { getContractName,
      getFlattenedContractPath,
      getFlattenedContractPaths,
      getContractPath,
      getContractPaths,
      getContracts,
      getArtifactPath,
      readFile } = require('./helpers.js')


class Compiler {

  constructor(destination) {
    let artifactsPath = path.join(destination, './json/')
    this.destination = destination
    this.artifactor = new Artifactor(artifactsPath)
  }

  _clean(compiled, contractName) {
    let schema = Schema.normalize(compiled.contracts[contractName] || compiled.contracts[":" + contractName])
    return schema
  }

  _compileAndClean(filePath) {
    let source = fs.readFileSync(filePath, { encoding: 'utf8'})
    let compiled = solc.compile(source, 1)
    if (compiled.errors) {
      return { errors: compiled.errors }
    } else {
      let contractName = getContractName(filePath)
      return this._clean(compiled, contractName)
    }
  }

  _getContractObject(filePath) {
    let compiled = this._compileAndClean(filePath)
    if (compiled.errors) {
      console.log(compiled.errors)
    } else {
      let contractName = getContractName(filePath)
      return contract({
        contractName: contractName,
        abi: compiled.abi,
        binary: compiled.bytecode
      })
    }
  }

  async getBytecode(contractName) {
    let filePath = getArtifactPath(contractName)
    let [error, bytecode] = await until(this.getBytecodeFromFile(filePath))
    if (error) throw error;

    return bytecode
  }

  async getBytecodeFromFile(filePath) {
    let [error, json] = await until(readFile(filePath))
    if (error) throw error;

    return JSON.parse(json).bytecode
  }

  async getABI(contractName) {
    let filePath = getArtifactPath(contractName)
    let [error, abi] = await until(this.getABIFromFile(filePath))
    if (error) throw error;

    return abi
  }

  async getABIFromFile(filePath) {
    let [error, json] = await until(readFile(filePath))
    if (error) throw error;

    return JSON.parse(json).abi
  }

  async compile(contractName) {
    let filePath = getContractPath(contractName)
    let [error] = await until(concatenate(filePath))
    if (error) throw new Error('Could not concatenate files')

    let concatenatedFilePath = getFlattenedContractPath(contractName)
    let contract = this._getContractObject(concatenatedFilePath)
    if (contract.errors) throw new Error('Could not compile contracts')

    await this.artifactor.save(contract)
    if (error) throw new Error('Could not save contract')
  }

  async compileFromPath(filePath) {
    let [error] = await until(concatenate(filePath))
    if (error) throw new Error('Could not concatenate files')

    let concatenatedFilePath = getFlattenedContractPath(contractName)
    let contract = this._getContractObject(concatenatedFilePath)
    if (contract.errors) throw new Error('Could not compile contracts')

    let [error] = await until(this.artifactor.save(contract))
    if (error) throw new Error('Could not save contract')
  }

  //TODO await this.compile or just this.compile ?
  async compileAll(contractNames) {
    let promises = contractNames.map(async(contract) => { await this.compile(contract)})

    let [errors] = await catchify.all(promises)
    if (errors) throw new Error('Could not compile all contracts')
  }
}

module.exports = Compiler