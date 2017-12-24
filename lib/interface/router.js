const AccountMenu = require('./account_menu')
const DeployerMenu = require('./deployer_menu')
const SettingsMenu = require('./settings_menu')
const CompilerMenu = require('./compiler_menu')


class Router {

  constructor({mainMenu}) {
    this.mainMenu = mainMenu
    this.accountMenu = new AccountMenu({router: this})
    this.deployerMenu = new DeployerMenu({router: this})
    this.compilerMenu = new CompilerMenu({router: this})
    this.settingsMenu = new SettingsMenu({router: this})
  }

  async openAccountMenu({settings}) {
    await this.accountMenu.open({settings})
  }

  async openDeployerMenu({settings}) {
    await this.deployerMenu.open({settings})
  }

  async openSettingsMenu({settings}) {
    await this.settingsMenu.open({settings})
  }

  async openMainMenu({settings}) {
    await this.mainMenu.open({settings})
  }

  async openCompilerMenu({settings}) {
    await this.compilerMenu.open({settings})
  }


}

module.exports = Router