

const Interface = require('./menu')
const AccountMenu = require('./account_menu')
const DeployerMenu = require('./deployer_menu')
const SettingsMenu = require('./settings_menu')
const CompilerMenu = require('./compiler_menu')


class Router {

  constructor({mainMenu}) {
    if (mainMenu) this.mainMenu = mainMenu
  }

  async openMainMenu({settings, mainMenu}) {
    mainMenu ? this.mainMenu = mainMenu : this.mainMenu = new Interface({settings: settings, router: this})
    await this.mainMenu.open({settings})
  }

  async openAccountMenu({settings}) {
    this.accountMenu = new AccountMenu({router: this, settings: settings})
    await this.accountMenu.open({settings})
  }

  async openDeployerMenu({settings}) {
    this.deployerMenu = new DeployerMenu({router: this, settings: settings})
    await this.deployerMenu.open({settings})
  }

  async openSettingsMenu({settings}) {
    this.settingsMenu = new SettingsMenu({router: this, settings: settings})
    await this.settingsMenu.open({settings})
  }

  async openCompilerMenu({settings}) {
    this.compilerMenu = new CompilerMenu({router: this, settings: settings})
    await this.compilerMenu.open()
  }


}

module.exports = Router