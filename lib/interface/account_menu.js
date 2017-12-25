require('../utils');

const command = require('inquirer');
const until = require('catchify')

const questions = require('../questions');
command.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const Display = require('../display.js');
const Config = require('../config/index.js')
const Account = require('../account.js')
const Interface = require('./menu.js')

const display = new Display();
const config = new Config();

class AccountMenu {

  constructor({router}) {
    this.router = router
  }

  async open({settings}) {
    if (settings) this.settings = settings

    await this.showAccountMenu()
  }

  async showAccountMenu() {
    display.message.accountMenu();

    let menu = questions.accountConfigurationMenu({additionalFields: ['Back', 'Close']})
    const options = await command.prompt(menu);

    if (options.choice === 'List ethereum wallets') {
      await this.listWalletsMenu()
      await this.showAccountMenu()
    }
    else if (options.choice === 'Create new ethereum wallet') {
      await this.showCreateWalletForm()
      await this.showAccountMenu()
    }
    else if (options.choice === 'Delete wallet') {
      await this.showDeleteWalletForm()
      await this.showAccountMenu()
    }
    else if (options.choice === 'Expose ethereum wallet private keys') {
      await this.showExposePrivateKeysForm()
      await this.showAccountMenu()
    }
    else if (options.choice === 'Back') {
      await this.router.openMainMenu({settings: this.settings})
    }
    else if (options.choice === 'Close') {
      process.exit(1)
    }
  }

  async showCreateWalletForm() {
    var [err] = await until(Account.createWallet())
    if (err) console.log(err)

    display.message.walletCreated();
    await display.waitUntilKeyPress()

  }

  async showDeleteWalletForm() {
    var [err] = await until(Account.deleteWallet())
    if (err) console.log(err)

    display.message.walletDeleted()
    await display.waitUntilKeyPress()
  }

  async listWalletsMenu() {
    Account.printAllWallets()

    await display.waitUntilKeyPress()
    await this.showAccountMenu()
  }

  async showExposePrivateKeysForm() {
    await Account.printPrivateKey()
    await display.waitUntilKeyPress()
    await this.showAccountMenu()
  }

}


module.exports = AccountMenu