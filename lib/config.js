const path = require('path')
const fs = require('fs-extra')

class Config {

  constructor() {
    this.globalContractSettings = path.join(__dirname, './contracts/configuration.json')
    this.globalDefaultContractSettings = path.join(__dirname, './contracts/default_configuration.json')
    this.globalFlattenedContractsDir = path.join(__dirname, './contracts/solidity/flattened_contracts/')
    this.globalContractDependenciesDir = path.join(__dirname, './contracts/solidity/dependencies/')
    this.localDir = path.join('./')
    this.localContractDir = path.join(this.localDir, './contracts/')
    this.localArtifactsDir = path.join(this.localDir, './contracts/json')
    this.localContractSettings = path.join(this.localDir, './contracts/settings.json')
    this.localDependenciesDir = path.join(this.localDir, './contracts/dependencies/')
    this.localFlattenedContractsDir = path.join(this.localDir, './contracts/')
  }

  createLocalConfig() {
    fs.copySync(this.globalContractSettings, this.localContractSettings)
  }

  createDefaultLocalConfig() {
    fs.copySync(this.globalDefaultContractSettings, this.localContractSettings)
  }

  localContractSettings() {
    let json = fs.readJSONSync(this.localContractSettings)
    return json
  }

  globalContractSettings() {
    let json = fs.readJSONSync(this.globalContractSettings)
    return json
  }

  localArtifacts() {
    let json = fs.readJSONSync(this.localArtifactsDir)
    return json
  }

  updateLocalContractSettings(settings) {
    if (path.extname(settings) == 'json') {
      let json = fs.readJSONSync(settings)
      fs.writeJSONSync(this.localContractSettings, json)
    } else {
      fs.writeJSONSync(this.localContractSettings, settings)
    }
  }

  updateGlobalContractSettings(json) {
    fs.writeJSONSync(this.globalContractSettings, json)
  }

  updateDefaultGlobalContractSettings(json) {
    fs.writeJSONSync(this.globalDefaultContractSettings, json)
  }

}

module.exports = Config