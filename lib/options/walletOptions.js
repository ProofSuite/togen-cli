require('../utils.js')

const command = require('inquirer')
const questions = require('../questions')
const validators = require('../validators/index.js');

class WalletOptions {

    constructor(parameters) {
      this.setType(parameters.type)
    }

    setType(type) {
      this.type = type || 'wallet'
    }

    // TODO complete this validation
    verifySettings() {
      console.assert(validators.isWalletType(this.type))
      return true
    }

    async updateType() {
      let { choice } = await command.prompt(questions.walletType)

      if (choice == 'Multisig') {
        choice = 'multisig'
      } else {
        choice = 'wallet'
      }

      this.setType(choice)
    }

  }

  module.exports = WalletOptions