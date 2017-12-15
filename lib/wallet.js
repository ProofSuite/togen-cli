const lightwallet = require('eth-lightwallet')
const util = require('util')
const until = require('catchify')
const fs = require('fs-extra')
const path = require('path')

const Config = require('./config/index.js')
let config = new Config()

const _ = require('./helpers.js')

let createVault = util.promisify(lightwallet.keystore.createVault)
let deriveKey = util.promisify(lightwallet.keystore.deriveKeyFromPasswordAndSalt)


class Wallet {

  constructor({file}) {
    if (file) {
      this.filePath = this._formatFilePath(file) //resolve absolute filepath
      this.name = _.getJSONName(file)
    }
  }

  _formatFilePath(filePath) {
    let formattedPath
    if (!path.isAbsolute(filePath)) {
      formattedPath = path.join(config.user.wallets, filePath)
    }
    else {
      formattedPath = filePath
    }

    return formattedPath
  }

  _getKeyStore() {
    let fileContents = fs.readFileSync(this.filePath)
    let keystore = lightwallet.keystore.deserialize(fileContents)
    return keystore
  }

  getAddress() {
    let keystore = this._getKeyStore()
    return keystore.getAddresses()[0]
  }

  async getDerivedKey(password) {
    let keystore = this._getKeyStore()
    keystore.keyFromPassword = util.promisify(keystore.keyFromPassword)

    var [err, derivedKey] = await until(keystore.keyFromPassword(password))
    if (err) throw err;
    return derivedKey
  }

  async getPrivateKey(password) {
    let keystore = this._getKeyStore()

    var [err, derivedKey] = await until(this.getDerivedKey(password))
    if (err) throw err;

    const seed = keystore.getSeed(derivedKey)
    const address = this.getAddress()
    const privateKey = keystore.exportPrivateKey(address, derivedKey)

    return {privateKey, seed}
  }


  getFilePath() {
    let filePath = path.join(config.localAccount, `${name}.json`)
    if (!fs.existsSync(filePath)) throw new Error('Path does not exist')
    return filePath
  }

  static async create(password) {
    let seedPhrase = lightwallet.keystore.generateRandomSeed()
    let hdPathString = "m/44'/60'/0'/0"

    let keystore = await createVault({password: password, hdPathString: hdPathString, seedPhrase: seedPhrase, salt: 'lightwalletsalt'})
    keystore.keyFromPassword = util.promisify(keystore.keyFromPassword)

    var [err, derivedKey] = await until(keystore.keyFromPassword(password))
    keystore.generateNewAddress(derivedKey, 1);
    return keystore
  }

}

module.exports = Wallet