const solc = require('solc')
const Artifactor = require('truffle-artifactor')
const Schema = require('truffle-contract-schema')
const contract = require('truffle-contract')
const fs = require('fs')
const path = require('path')

let { getContractName,
      getContracts } = require('./helpers.js')


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
    console.log(compiled)
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

  getByteCode(filePath) {
    return this._compileAndClean(filePath).bytecode
  }

  getAbi(filePath) {
    return this._compileAndClean(filePath).abi
  }


  async compile(filePath) {
    let contract = this._getContractObject(filePath)
    await this.artifactor.save(contract)
    console.log('File was created!')
  }

  async compileAll() {
    let contractFiles = await getContracts()
    contractFiles.forEach(async(file) => {
      let contract = this._getContractObject(file)
      await this.artifactor.save(contract)
    })
  }

}

module.exports = {
  Compiler
}