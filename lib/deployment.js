const contract = require("truffle-contract")
const fs = require('fs-extra')
const until = require('catchify')
const Logger = require('./memorylogger.js')

const logger = new Logger()

const LightWalletProvider = require('./provider/lightwallet_provider')
const TruffleDeployer = require('truffle-deployer')
const Config = require('./config/index.js')
const Deployer = require('./deployer.js')

let config = new Config()
let validator = require('./validators/index.js')

//We use an additional deployment class on top of the deployer itself.
//Therefore the deployer only depends on the interface of the provider and the truffle deployer
//and is more easily modifiable/customizable
class Deployment {

  constructor(params) {
    let settings = config.user.parseDeploymentSettings()
    let address = params.defaultWallet || settings.defaultWallet
    let wallet = config.user.getWalletByAddress(address)


    this.walletAddress = wallet.address
    this.walletPath = wallet.filePath
    this.network = params.network || settings.defaultNetwork
    this.network_id = params.network_id || Deployment.getNetworkID(this.network)
    this.gasLimit = params.gasLimit || settings.defaultGasLimit
    this.gasPrice = params.gasPrice || settings.defaultGasPrice
    this.infuraToken = settings.infuraToken || ""
    this.password = params.password
    this.contracts = params.contracts
    this.constructorArguments = params.args || []
    this.deployer = params.deployer || new Deployer()
    this.rpcURL = params.rpcURL || `https://${this.network}.infura.io/${this.infuraToken}`

  }


  validateDeploymentSettings() {
    console.assert(validator.isValidAddress(this.walletAddress))
    console.assert(validator.isNetwork(this.network))
    console.assert(validator.isPositiveNumber(this.network_id))
    console.assert(validator.isPositiveNumber(this.gasLimit))
    console.assert(validator.isPositiveNumber(this.gasPrice))
    console.assert(validator.isString(this.rpcURL))
  }


  async start() {
    this.validateDeploymentSettings()

    let provider = new LightWalletProvider({
      keystore: this.walletPath,
      password: this.password,
      rpcUrl: this.rpcURL,
      debug: false
    })


    let truffleDeployer = new TruffleDeployer({
      contracts: this.contracts,
      network: this.network,
      network_id: this.network_id,
      provider: provider
    });

    truffleDeployer.start()

    let defaults = {
      from: this.walletAddress,
      gas: this.gasLimit * (10 ** 6),
      gasPrice: this.gasPrice * (10 ** 9)
    }

    this.deployer.setTruffle(truffleDeployer)
    this.deployer.setContractObject(this.contracts, defaults)
    this.deployer.setContractProvider(provider)
    this.deployer.setContractNetwork(this.network)

    var [error, deployed] = await until(this.deployer.deployContract(this.constructorArguments, defaults))
    if (error) throw err;
}


  static getNetworkID(network) {
    if (network == 'mainnet') {
      return 1
    }
    else if (network == 'ropsten') {
      return 3
    }
    else if (network == 'rinkeby') {
      return 4
    }
  }

}

module.exports = Deployment