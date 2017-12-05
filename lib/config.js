const path = require('path')
const fs = require('fs-extra')



//TODO convert back to a simple function ? (not sure)
class Config {

  //TODO check which paths are needed and remove the unused ones
  constructor() {
    this.globalDir = path.join(__dirname)
    this.globalContractDir = path.join(__dirname, './contracts/global/')
    this.defaultContractsDir = path.join(__dirname, './contracts/default/')
    this.globalSettingsFile = path.join(__dirname, './contracts/global/settings.json')
    this.defaultSettingsFile = path.join(__dirname, './contracts/default/settings.json')
    this.globalFlattenedContractsDir = path.join(this.globalContractDir, './solidity/flattened_contracts/')
    this.globalContractDependenciesDir = path.join(this.globalContractDir, './solidity/dependencies/')
    this.localDir = path.join('./')
    this.localArtifactsDir = path.join(this.localDir, './contract_objects')
    this.localSettingsFile = path.join(this.localDir, './settings.json')
    this.localDependenciesDir = path.join(this.localDir, './solidity/dependencies/')
    this.localContractsDir = path.join(this.localDir, './solidity/')
    this.localFlattenedContractsDir = path.join(this.localDir, './solidity/flattened_contracts/')
  }

  createLocalConfig(dirName) {
    dirName = dirName || 'togen'
    fs.copySync(this.defaultContractsDir, path.join('./', dirName))
  }

  createDefaultLocalConfig() {
    fs.copySync(this.defaultContractsDir, this.localDir)
  }

  copyDefaultSettings() {
    fs.copySync(this.defaultSettingsFile, this.localSettingsFile)
  }

  localSettings() {
    let json = fs.readJSONSync(this.localSettingsFile)
    return JSON.parse(json)
  }

  localArtifacts() {
    let json = fs.readJSONSync(this.localArtifactsDir)
    return JSON.parse(json)
  }

  createLocalAccount() {
    
  }

  localAccount() {
    let json = fs.readJSONSync(this.localSettingsFile)
    return JSON.parse(json)["accounts"]
  }

  //TODO replace path.extame == .. by a more sophisticated check (isPath)
  updateLocalSettings(settings) {
    if (path.extname(settings) == '.json') {
      let json = fs.readJSONSync(settings)
      fs.writeJSONSync(this.localSettingsFile, json)
    } else {
      fs.writeJSONSync(this.localSettingsFile, settings)
    }
  }

  updateDefaultSettings(json) {
    fs.writeJSONSync(this.defaultSettingsFile, json)
  }

}

module.exports = Config