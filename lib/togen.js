const path = require('path')
const fs = require('fs-extra')

const Config = require('./config')
const Console = require('./interface/console')
const SettingsMenu = require('./interface/settings_menu')
const Compiler = require('./compiler.js')
const Options = require('./options/index.js')

let version = require('../package.json').version;
let assembler = require('./assembler/index.js')




class Togen {

  constructor() {
    this.version = version;
    this.config = new Config()
    this.console = new Console()
    this.settingsMenu = new SettingsMenu()
    this.compiler = new Compiler(this.config.localDir)
  }

  init() {
    this.config.createLocalConfig()
  }

  console() {
    this.console.start()
  }

  //TODO add possibility to configure from JSON HTTP
  //TODO need to create an option that creates default for just some contracts
  configure(options) {
    if (options.file) {
      let filePath = path.join(options.file)
      this.config.updateLocalContractSettings(filePath)
    }
    else if (options.default) {
      this.config.createDefaultLocalConfig()
    }
    else {
      this.settingsMenu.start()
    }
  }

  async assemble(options) {
    if (options.all) {
      let settings = this.config.localContractSettings()
      let localPath = this.config.localContractsDir
      await assembler.buildFromJSON(settings, localPath)
    }
    else if (options.file) {
      let filePath = path.join(options.file)
      let json = fs.readJSONSync(filePath)
      this.config.updateLocalContractSettings(filePath)
      let localPath = this.config.localContractsDir
      await assembler.buildFromJSON(json, localPath)
    }
    else if (options.contract) {
      await assembler.buildContract(options.contract)
    }
    else if (options.output) {
      let settings = this.config.localContractSettings()
      await assembler.buildFromJSON(settings, options.output)
    }
    else if (options.print) {
      let settings = this.config.localContractSettings()
      await assembler.print(settings)
    }
  }


  async compile(options) {
    let contracts;

    if (options.all) {
      let json = this.config.localContractSettings()
      let settings = JSON.parse(json)
      let options = new Options(settings)
      contracts = options.getIncludedContracts()
    }
    else if (options.contract) {
      contracts = [ options.contract ]
    }
    else if (options.file) {
      let filePath = path.join(options.file)
      let json = fs.readJSONSync(filePath)
      let settings = JSON.parse(json)
      this.config.updateLocalContractSettings(filePath)
      contracts = settings.getIncludedContracts()
    }

    await this.compiler.compileAll(contracts)

    //TODO optimize (instead of recompiling the contract, just read the bytecode from the file)
    //TODO create and enhance these functions in the options classes
    if (options.bytecode) {
      contracts.forEach(async (contract) => {
        let bytecode = await this.compiler.getByteCode(contract)
        console.log(bytecode)
      })
    }

    //TODO display a pretty json format of the interface
    else if (options.interface) {
      contracts.forEach(async (contract) => {
        let abi = await this.compiler.getABI(contract)
        console.log(abi)
      })
    }
  }
}

module.exports = Togen