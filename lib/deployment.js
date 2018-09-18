const contract = require("truffle-contract")
const fs = require('fs-extra')
const until = require('catchify')
const Wallet = require('./wallet')

const LightWalletProvider = require('./provider/lightwallet_provider')
const SignerProvider = require('ethjs-provider-signer')
const Signer = require('ethjs-signer');
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
    let keystore = config.user.getWalletByAddress(address)

    this.wallet = new Wallet({file: keystore.filePath})
    this.network = params.network || settings.defaultNetwork
    this.network_id = params.network_id || Deployment.getNetworkID(this.network)
    this.gasLimit = params.gasLimit || settings.defaultGasLimit
    this.gasPrice = params.gasPrice || settings.defaultGasPrice
    this.infuraToken = settings.infuraToken || ""
    this.password = params.password
    this.contracts = params.contracts
    this.constructorArguments = params.args || []
    this.rpcURL = params.rpcURL || `https://${this.network}.infura.io/${this.infuraToken}`
  }


  validateDeploymentSettings() {
    console.assert(validator.isNetwork(this.network))
    console.assert(validator.isPositiveNumber(this.network_id))
    console.assert(validator.isPositiveNumber(this.gasLimit))
    console.assert(validator.isPositiveNumber(this.gasPrice))
    console.assert(validator.isString(this.rpcURL))
  }


  async start() {
    this.validateDeploymentSettings()

    let { privateKey } = await this.wallet.getPrivateKey(this.password)

    const provider = new SignerProvider(this.rpcURL, {
      signTransaction: (rawTx, cb) => cb(null, Signer.sign(rawTx, '0x' + privateKey))
    })

    this.deployer = new Deployer(provider)
    this.deployer.createDeploymentTransaction(this.contracts, this.wallet, this.gasLimit * 10 ** 6)

    var [error, txHash] = await until(this.deployer.deployContract(this.constructorArguments))
    if (error) throw error;

    return txHash
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