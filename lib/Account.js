const lightwallet = require('eth-lightwallet')
const util = require('util')
const until = require('catchify')
const fs = require('fs-extra')
const command = require('inquirer')
const path = require('path')

const Config = require('./config/index.js')
const Display = require('./display.js')

let display = new Display()
let config = new Config()

const Wallet = require('./wallet')

const questions = require('./questions')
let createVault = util.promisify(lightwallet.keystore.createVault)
let deriveKey = util.promisify(lightwallet.keystore.deriveKeyFromPasswordAndSalt)


class Account {

  constructor() {
  }


  static wallets() {
    let wallets = {}
    let walletFiles = fs.readdirSync(config.user.wallets)

    walletFiles.forEach(file => {
      let wallet = new Wallet({file})
      let address = wallet.getAddress()
      wallets[file] = address
    })

    return wallets
  }

  static walletObjects() {
    let wallets = []
    let walletFiles = fs.readdirSync(config.user.wallets)

    walletFiles.forEach(file => {
      let wallet = new Wallet({file})
      wallets.push(wallet)
    })

    return wallets
  }

  static walletRecords() {
    return config.user.parseWalletRecords()
  }

  static printAllWallets() {
    let records = config.user.parseWalletRecords()
    if (records.length >= 1) {
      for (let wallet of records) {
        display.wallet(wallet)
      }
    }
    else {
      console.log("Could not find any wallets")
    }
  }

  static filterWallets({address, network}) {
    let records = config.user.parseWalletRecords()
    if (network) return records[network]
  }

  static walletAddresses() {
    return Object.values(this.wallets())
  }

  static walletFiles() {
    return Object.keys(this.wallets())
  }


  static findWallet(address) {
    let files = this.walletFiles()

    for(let file of files) {
      let wallet = new Wallet({file: file})
      let walletAddress = wallet.getAddress()
      if (address == walletAddress) {
        return wallet
      }
    }
  }

  static findWalletByName(name) {
    let files = this.walletFiles()

    for (let file of files) {
      let wallet = new Wallet({file: file})
      if (name == wallet.name) {
        return wallet
      }
    }
  }

  static async createWallet() {
    const { name, password, network } = await command.prompt(questions.createWallet)
    const filePath = path.join(config.user.wallets, `${name}.json`)

    if (fs.existsSync(filePath)) throw new Error('Account already exists')
    process.stdout.write('Generation account ...\n')

    const keystore = await Wallet.create(password)
    const address = keystore.getAddresses()[0]

    config.user.saveWalletRecord(name, filePath, network, address)
    config.user.saveWallet(filePath, keystore)
  }

  static async deleteWallet() {
    let wallets = config.user.parseWalletRecords()
    let walletList = questions.deleteWallet(wallets)
    const { address } = await command.prompt(walletList)

    let walletRecord = config.user.getWalletByAddress(address)
    if (!walletRecord) throw new Error('Wallet not found')

    var [err] = await until(Wallet.deleteFile(walletRecord.filePath))
    if (err) console.log(err)

    config.user.deleteWalletRecord({filePath: walletRecord.filePath})
  }

  static async chooseDefaultWallet() {
    console.log("I am here")
    let wallets = config.user.parseWalletRecords()
    console.log(wallets)
    let walletList = questions.chooseDefaultWallet(wallets)
    var [err, {address}] = await until(command.prompt(walletList))
    if (err) throw new Error(err)

    console.log(address)
    let walletRecord = config.user.getWalletByAddress(address)
    if (!walletRecord) throw new Error('Wallet not found')

    var [err] = await until(config.user.updateDefaultWallet(walletRecord.filePath))
    if (err) console.log(err)

    display.message.defaultWalletUpdated();
  }


  static async printPrivateKey() {
    display.message.exposePrivateKeysWarning()

    let addresses = this.walletAddresses()
    let menu = questions.walletList(addresses)

    var [err, { address }] = await until(command.prompt(menu))
    if (err || !address) throw err;

    var [err, { password }] = await until(command.prompt(questions.walletPassword))
    if (err || !password) throw err;

    var [err, { confirm }] = await until(command.prompt(questions.confirmExposePrivateKey))
    if (err || !confirm) throw err;

    let wallet = this.findWallet(address)
    if (!wallet) throw new Error('Could not find wallet')

    var [err, secret] = await until(wallet.getPrivateKey(password))
    if (err) throw err;

    display.privateKey(wallet, address, secret)
  }

  static async setInfuraToken() {
    let { token } = await command.prompt(questions.infuraTokenForm)
    if (token) config.user.updateInfuraToken(token)

    await display.message.infuraTokenUpdated()
    await display.waitUntilKeyPress()
  }


}

module.exports = Account