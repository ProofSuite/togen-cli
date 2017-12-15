const path = require('path')
const fs = require('fs-extra')


class ContractConfiguration {

  constructor() {
    this.solidity = path.join(process.cwd(), './solidity/')
    this.artifacts = path.join(process.cwd(), './contract_objects')
    this.settingsFile = path.join(process.cwd(), './settings.json')
    this.flattened = path.join(process.cwd(), './solidity/flattened_contracts/')
    this.dependencies = path.join(process.cwd(), './solidity/dependencies/')
  }

  parseSettings() {
    let json = fs.readJSONSync(this.settingsFile)
    return JSON.parse(json)
  }

  artifacts() {
    let json = fs.readJSONSync(this.settingsFile)
    return JSON.parse(json)
  }


  updateSettings(settings) {
    if (typeof settings == "string" && path.extname(settings) == '.json') {
      let json = fs.readJSONSync(settings)
      fs.writeJSONSync(this.settingsFile, json)
    }
    else {
      fs.writeJSONSync(this.settingsFile, settings)
    }
  }
}

module.exports = ContractConfiguration
