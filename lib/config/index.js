const path = require('path')
const fs = require('fs-extra')

const ContractsConfiguration = require('./ContractsConfiguration')
const DefaultConfiguration = require('./DefaultConfiguration')
const UserConfiguration = require('./UserConfiguration')
const constants = require('./constants')


class Config {

  constructor() {
    this.contracts = new ContractsConfiguration()
    this.default = new DefaultConfiguration()
    this.user = new UserConfiguration()
    this.constants = constants
  }

  createLocalConfig(name) {
    name = name || 'togen'
    fs.copySync(this.default.contractsDir, path.join('./', name))
  }

  copyDefaultSettings() {
    fs.copySync(this.default.settings, this.user.settings)
  }

}

module.exports = Config