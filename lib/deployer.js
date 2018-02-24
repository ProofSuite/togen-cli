//Just some sample code
const contract = require("truffle-contract")
const fs = require('fs-extra')
const until = require('catchify')
const path = require('path')
const Config = require('./config/index.js')
const Display = require('./display')

let config = new Config()
let display = new Display()


class Deployer {

  constructor(params) {
  }

  setTruffle(truffleDeployer) {
    this.truffleDeployer = truffleDeployer
  }

  setContractObject(name, defaults) {
    let contractName = name.camelize().capitalize() + '.json'

    let contractFilePath = path.join(config.contracts.artifacts, contractName)
    let contractData = fs.readJSONSync(contractFilePath)

    this.contractObject = contract({
      contract_name: contractName,
      unlinked_binary: contractData.bytecode,
      abi: contractData.abi
    })

    this.contractObject.defaults({
      from: defaults.from,
      gas: defaults.gas,
      gasPrice: defaults.gasPrice
    })
  }

  setContractProvider(provider) {
    this.contractObject.setProvider(provider)
  }

  setContractNetwork(network) {
    this.contractObject.setNetwork(network)
  }

  async deployContract(constructorArguments) {
    try {
      // let args = Object.values(constructorArguments)
      // var [err, deployedContract] = await until(this.truffleDeployer.deploy(this.contractObject, ...args))
      // var [err, deployedContract] = await until(this.truffleDeployer.deploy(this.contractObject))
      let res = await until(this.truffleDeployer.deploy(this.contractObject))

    } catch(e) {
      console.log(e)
      await display.waitUntilKeyPress()
    }
  }
}

module.exports = Deployer