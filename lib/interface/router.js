const AccountMenu = require('./account_menu')
const DeployerMenu = require('./deployer_menu')
const SettingsMenu = require('./settings_menu')


class Router {

  constructor() {
    this.accountMenu = new AccountMenu()
    this.deployerMenu = new DeployerMenu()
    this.settingsMenu = new SettingsMenu()
  }

  async openAccountMenu() {
    await this.accountMenu.open()
  }

  async openDeployerMenu() {
    await this.deployerMenu.open()
  }

  async openSettingsMenu() {
    await this.settingsMenu.open()
  }


}

module.exports = Router