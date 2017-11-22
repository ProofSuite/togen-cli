const Config = require('./config')
const Console = require('./interface/console')
const SettingsMenu = require('./interface/settings_menu')
let version = require('../package.json').version;


class Togen {

  constructor() {
    this.version = version;
    this.config = new Config()
    this.console = new Console()
    this.settingsMenu = new SettingsMenu()
  }

  init() {
    this.config.createLocalConfig()
  }

  console() {
    this.console.start()
  }

  configure(options) {
    if (options.default) {
      this.config.createDefaultLocalConfig()
    }
    else if (options.file) {
      this.config.updateLocalContractSettings(options.file)
    }
    else if (options.interactive) {
      this.settingsMenu.start()
    }
  }



}

module.exports = Togen