const path = require('path')
const fs = require('fs-extra')
const app = require('app-root-path')


class DefaultConfiguration {

  constructor() {
    this.baseDir = path.join(__dirname, '..')
    this.contractsDir = path.join(this.baseDir, './contracts/default/')
    this.settings = path.join(this.baseDir, './contracts/default/settings.json')
    this.flattenedContractsDir = path.join(this.baseDir, this.contractsDir, './solidity/flattened_contracts/')
    this.contractDependenciesDir = path.join(this.baseDir, this.contractsDir, './solidity/dependencies/')
  }

  updateDefaultSettings(json) {
    fs.writeJSONSync(this.settings, json)
  }

}

module.exports = DefaultConfiguration