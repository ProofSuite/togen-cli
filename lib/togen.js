const path = require('path')
const fs = require('fs-extra')
const until = require('catchify')

const Config = require('./config')
const Interface = require('./interface/menu')
const SettingsMenu = require('./interface/settings_menu')
const AccountMenu = require('./interface/account_menu')
const DeployerMenu = require('./interface/deployer_menu')
const Compiler = require('./compiler.js')
const Options = require('./options/index.js')
const Display = require('./display.js')
const Logger = require('./logger.js')
const AppError = require('./errors/AppError.js')


let version = require('../package.json').version;
let assembler = require('./assembler/index.js')
let config = new Config
let display = new Display()
let log = new Logger()
let compiler = new Compiler(config.localDir)
let _ = require('./helpers.js')



class Togen {

  constructor() {
    this.version = version;
    this.interface = new Interface()
    this.settingsMenu = new SettingsMenu()
    this.accountsMenu = new AccountMenu()
    this.deployerMenu = new DeployerMenu()
  }

  init(options) {
    display.spinner.start("Creating togen folder ...")
    if (options.name && typeof options.name == 'string') {
      config.createLocalConfig(options.name)
    } else {
      config.createLocalConfig('togen')
    }
    display.spinner.succeed("Togen folder created")
  }

  async interactive() {
    let configured = await _.fileExists('./settings.json')
    if (configured) {
      this.interface.open()
    }
    else {
      log.togenNotDetected();
    }
  }

  //TODO add possibility to configure from JSON HTTP
  //TODO need to create an option that creates default for just some contracts
  configure(options) {

    if (options.show) {
      if (options.file) {
        let filePath = path.join(options.file)
        display.fileConfiguration(filePath)
      }
      else if (options.default) {
        display.defaultConfiguration()
      }
      else {
        display.localConfiguration()
      }
    }

    if (options.edit) {
      if (options.file) {
        display.spinner.start("Loading configuration from file")
        let filePath = path.join(options.file)
        config.updateLocalSettings(filePath)
        display.spinner.succeed("Configuration loaded from file")
      }
      else if (options.default) {
        display.spinner.start("Loading default configuration")
        config.copyDefaultSettings()
        display.spinner.succeed("Default configuration loaded")
      }
      else {
        this.settingsMenu.open()
      }
    }

    if (options.account) {
      this.accountsMenu.open()
    }
  }

  async assemble(options) {
    let settings
    let output = options.output || config.localContractsDir
    let print = options.print || false
    let contracts = options.contracts || Options.getLocalContracts()
    display.spinner.start("Loading configuration")
    if (options.file) {
      settings = Options.parseSettings(options.file)
      config.contracts.updateSettings(settings)
    }
    else {
      settings = Options.parseLocalSettings()
    }

    if (!settings) {
      throw new AppError('CONFIG_ERROR', 'Settings object is empty')
      display.spinner.fail("Configuration could not be loaded")
    } else {
      display.spinner.succeed("Configuration loaded")
    }

    display.spinner.start("Assembling contracts")
    var [error] = await until(assembler.buildContracts(settings, contracts, {print, output}))
    if (error) {
      display.spinner.fail("Contracts could not be assembled")
      console.log(error)
    } else {
      display.spinner.succeed("Contracts assembled")
    }

  }


  async compile(options) {
    let settings
    let bytecode = options.bytecode || false
    let abi = options.abi || false
    let output = options.output || config.localContractsDir
    let contracts = options.contracts || Options.getLocalContracts()

    display.spinner.start("Loading configuration")
    if (options.file) {
      settings = Options.parseSettings(options.file)
      config.updateLocalSettings(settings)
    }
    else {
      settings = Options.parseLocalSettings()
    }

    if (!settings) {
      throw new AppError('CONFIG_ERROR', 'Settings object is empty')
      display.spinner.fail("Configuration could not be loaded")
    } else {
      display.spinner.succeed("Configuration loaded")
    }

    display.spinner.start("Assembling contracts")
    var [error, result] = await until(assembler.buildContracts(settings, contracts, {print: false, output: ''}))

    if (error) {
      display.spinner.fail("Contracts could not be assembled")
      console.log(error)
    } else {
      display.spinner.succeed("Contracts assembled")
    }

    display.spinner.start("Compiling contracts")
    var [error, result] = await until(compiler.compileContracts(contracts, {bytecode, abi, output}))

    if (error) {
      display.spinner.fail("Contracts could not be compiled")
      console.log(error)
    } else {
      display.spinner.succeed("Contracts compiled")
    }

    display.contractInfo(contracts, {bytecode, abi})
  }


  async deploy() {
    var [err] = await until(this.deployerMenu.open())
    if (err) console.log(err)
  }


  validateSettings() {
    if (!settings) {
      throw new AppError('CONFIG_ERROR', 'Settings object is empty')
      display.spinner.fail("Configuration could not be loaded")
    } else {
      display.spinner.succeed("Configuration loaded")
    }
  }

}

module.exports = Togen