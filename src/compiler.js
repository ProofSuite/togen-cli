const solc = require('solc')
const Artifactor = require('truffle-artifactor')
const Schema = require('truffle-contract-schema')
const contract = require('truffle-contract')
const fs = require('fs')
const path = require('path')
const config = require('../config.js')
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
    this.destination = destination
    this.artifactor = new Artifactor(destination)
  }

  _clean(compiled, contractName) {
    return Schema.normalize(compiled.contracts[contractName] || compiled.contracts[":" + contractName])
  }

  _compileAndClean(filePath) {
    let source = fs.readFileSync(filePath, { encoding: 'utf8'})
    let compiled = solc.compile(source, 1)
    let contractName = getContractName(filePath)
    return this._clean(compiled, contractName)
  }

  _getContractObject(filePath) {
    let cleanCompiled = this._compileAndClean(filePath)
    let contractName = getContractName(filePath)
    return contract({
      contractName: contractName,
      abi: cleanCompiled.abi,
      binary: cleanCompiled.bytecode
    })
  }

  async saveConfiguration() {
    let json = JSON.stringify(this)
    await h.writeFile('./src/contracts/configuration.json', json)
  }

  async loadConfiguration() {
    let json = await h.readFile('./src/contracts/configuration.json')
    let savedConfiguration = JSON.parse(json)
    Object.keys(this).forEach((key) => {
      this[key] = savedConfiguration[key]
    })
  }


  async getByteCode(contractName) {
    let filePath = await getArtifactPath(contractName)
    let json = await readFile(filePath)
    let bytecode = JSON.parse(json).bytecode
    return bytecode
  }

  async getABI(contractName) {
    let filePath = await getArtifactPath(contractName)
    let json = await readFile(filePath)
    let abi = JSON.parse(json).abi
    return abi
  }

  getAbi(contractName) {
    let filePath = getContractPath(contractName)
    return this._compileAndClean(filePath).abi
  }


  async compile(contractName) {
    let filePath = getContractPath(contractName)
    await concatenate(filePath)
    let concatenatedFilePath = getFlattenedContractPath(contractName)
    let contract = this._getContractObject(concatenatedFilePath)
    await this.artifactor.save(contract)
  }


  //TODO replace forEach by a promiseAll so that the execution is async
  async compileAll(contractNames) {
    let promises = contractNames.map(async(contract) => { await this.compile(contract)})
    await Promise.all(promises)
    // await display.waitUntilKeyPress();
  }
}

module.exports = Compiler