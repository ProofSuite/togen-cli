require('../utils');

const command = require('inquirer');
const until = require('catchify')
const path = require('path')

const questions = require('../questions');
command.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const Display = require('../display.js');
const Config = require('../config/index.js')
const Deployer = require('../deployer.js')
const Deployment = require('../deployment.js')
const Account = require('../Account.js')
const Interface = require('./menu.js')
const Options = require('../options/index.js')

const display = new Display();
const config = new Config();
const contractParser = require('../contract_parser')

class DeployerMenu {

  constructor({router, options}) {
    this.router = router
    this.options = options || Options.getLocal()
  }

  async open() {
    await this.showDeployerMenu()
  }

  async showDeployerMenu() {
    display.message.deployerMenu()
    let menu = questions.deployerConfigurationMenu({additionalFields: ['Close']})
    const options = await command.prompt(menu);

    if (options.choice === 'Show deployment settings') {
      await this.showDeploymentSettings()
    }
    else if (options.choice === 'Update deployment settings') {
      await this.showDeploySettingsMenu()
    }
    else if (options.choice === 'Deploy') {
      await this.showDeployContractsMenu()
    }
    else if (options.choice === 'Back') {
      await this.router.openMainMenu()
    }
    else if (options.choice === 'Close') {
      process.exit(1)
    }
  }

  async showDeploySettingsMenu() {
    display.message.deployerSettingsMenu()
    let menu = questions.deployerSettingsMenu({additionalFields: ['Back']})
    const options = await command.prompt(menu);

    if (options.choice === 'Show deployment settings') {
      await this.showDeploymentSettings()
      await this.showDeploySettingsMenu()
    }
    if (options.choice === 'Default Network/Wallet') {
      await this.showDefaultNetworkAndWalletForm()
      await this.showDeploySettingsMenu()
    }
    else if (options.choice === 'Configure Infura Token') {
      await this.showInfuraTokenForm()
      await this.showDeploySettingsMenu()
    }
    else if (options.choice === 'Configure Gas Options') {
      await this.showGasOptionsForm()
      await this.showDeploySettingsMenu()
    }
    else if (options.choice === 'Back') {
      await this.showDeployerMenu()
    }

  }

  async showDeploymentSettings() {
    let settings = config.user.parseDeploymentSettings()
    display.deploymentSettings(settings)

    await display.waitUntilKeyPress()
    await this.showDeployerMenu()
  }

  async showDefaultNetworkAndWalletForm() {
    let { network } = await command.prompt(questions.defaultNetworkForm)
    let wallets = config.user.getWalletsForNetwork(network)

    if (wallets.length == 0) {
      process.stdout.write('No wallet configured on this network')
    }
    else {
      let form = questions.defaultWalletForm(wallets)
      var  [err, { defaultWallet }] = await until(command.prompt(form))
      if (err) throw new Error(err)

      config.user.updateDefaultNetwork(network)
      config.user.updateDefaultWallet(defaultWallet)
      display.message.walletAndNetworkUpdated()

    }

    await display.waitUntilKeyPress()
    await this.showDeployerMenu()
  }

  async showInfuraTokenForm() {
    let { token } = await command.prompt(questions.infuraTokenForm)

    config.user.updateInfuraToken(token)

    display.message.infuraTokenUpdated()
    await display.waitUntilKeyPress()

    await this.showDeploySettingsMenu()
  }

  async showGasOptionsForm() {
    let { gasLimit, gasPrice } = await command.prompt(questions.gasOptionsForm)

    config.user.updateDefaultGasLimit(gasLimit)
    config.user.updateDefaultGasPrice(gasPrice)

    display.message.gasOptionsUpdated()
    await display.waitUntilKeyPress()

    await this.showDeploySettingsMenu()
  }

  async showDeployContractsMenu() {
    let contracts = Options.getLocalContracts()
    if (!contracts) console.log('No contracts found')

    const choice = await this.showContractMenu({ additionalFields: ['Back']})

    if (choice == 'Back') {
      await this.showDeployerMenu()
    }
    else {
      var [err, result] = await until(this.showDeployContractForm(choice))
      if (err) console.log(err)
    }
  }

  async showDeployContractForm(contract) {
    let fileName = contract.camelize().capitalize() + '.sol'
    let filePath = path.join(config.contracts.flattened, fileName)
    let constructorArguments = contractParser.getConstructorParameters({filePath: filePath})

    var [error, {password}] = await until(command.prompt(questions.walletPassword))
    if (error) console.log(error)

    if (constructorArguments.length > 0) {
      let form = questions.constructorArgumentsForm(constructorArguments)
      var [error, args] = await until(command.prompt(form))
      if (error) console.log(error)
    }

    let deployment = new Deployment({contracts: [ contract ], password, args})
    var [error] = await until(deployment.start())
    if (error) console.log(error)
  }


  async showContractMenu({ additionalFields = [] }) {
    let optionsList = this.options.getIncludedContracts().uncamelize();
    optionsList = optionsList.concat(additionalFields)
    const menu = questions.contractOptionsList(optionsList);
    const { choice } = await command.prompt(menu);
    return choice;
  }

}


module.exports = DeployerMenu