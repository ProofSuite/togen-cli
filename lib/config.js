const path = require('path')
const fs = require('fs-extra')


//TODO convert back to a simple function ? (not sure)
class Config {

  //TODO check which paths are needed and remove the unused ones

  constructor() {
    this.globalDir = path.join(__dirname)
    this.globalContractDir = path.join(__dirname, './contracts/global/')
    this.defaultContractDir = path.join(__dirname, './contracts/default/')
    this.globalSettingsFile = path.join(__dirname, './contracts/global/settings.json')
    this.defaultSettingsFile = path.join(__dirname, './contracts/default/settings.json')
    this.globalFlattenedContractsDir = path.join(this.globalContractDir, './solidity/flattened_contracts/')
    this.globalContractDependenciesDir = path.join(this.globalContractDir, './solidity/dependencies/')
    this.localDir = path.join('./')
    this.localArtifactsDir = path.join(this.localDir, './json')
    this.localSettingsFile = path.join(this.localDir, './settings.json')
    this.localDependenciesDir = path.join(this.localDir, './solidity/dependencies/')
    this.localContractsDir = path.join(this.localDir, './solidity/')
    this.localFlattenedContractsDir = path.join(this.localDir, './solidity/flattened_contracts/')
  }

  createLocalConfig() {
    fs.copySync(this.defaultContractDir, this.localContractDir)
  }

  copyGlobalConfig() {
    fs.copySync(this.globalContractDir, this.localDir)
  }

  createDefaultLocalConfig() {
    fs.copySync(this.defaultContractDir, this.localDir)
  }

  copyGlobalSettings() {
    fs.copySync(this.globalSettingsFile, this.localSettingsFile)
  }

  copyDefaultGlobalSettings() {
    fs.copySync(this.defaultSettingsFile, this.localContractsSettings)
  }

  localContractSettings() {
    let json = fs.readJSONSync(this.localSettingsFile)
    return json
  }

  globalSettingsFile() {
    let json = fs.readJSONSync(this.globalSettingsFile)
    return json
  }

  localArtifacts() {
    let json = fs.readJSONSync(this.localArtifactsDir)
    return json
  }

  //TODO replace path.extame == .. by a more sophisticated check (isPath)
  updateLocalContractSettings(settings) {
    if (path.extname(settings) == '.json') {
      let json = fs.readJSONSync(settings)
      fs.writeJSONSync(this.localSettingsFile, json)
    } else {
      fs.writeJSONSync(this.localSettingsFile, settings)
    }
  }

  updateGlobalContractSettings(json) {
    fs.writeJSONSync(this.globalSettingsFile, json)
  }

  updateDefaultGlobalContractSettings(json) {
    fs.writeJSONSync(this.defaultSettingsFile, json)
  }

}

module.exports = Config