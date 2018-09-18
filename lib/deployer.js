//Just some sample code
const contract = require("truffle-contract")
const fs = require('fs-extra')
const until = require('catchify')
const path = require('path')
const Config = require('./config/index.js')
const Display = require('./display')
const EthContract = require('ethjs-contract')
const Eth = require('ethjs-query');

let config = new Config()
let display = new Display()


class Deployer {

  constructor(provider) {
    const eth = new Eth(provider)
    this.contract = new EthContract(eth)
  }

  createDeploymentTransaction(name, wallet, gas) {
    let contractName = name.camelize().capitalize() + '.json'
    let contractFilePath = path.join(config.contracts.artifacts, contractName)
    let contractData = fs.readJSONSync(contractFilePath)

    this.contractFactory = this.contract(contractData.abi, contractData.bytecode, {
      from: wallet.address,
      gas: gas
    })
  }

  async deployContract(constructorArguments) {
    var [error, txHash] = await until(this.contractFactory.new())
    if (error) throw error;

    return txHash
  }
}

module.exports = Deployer