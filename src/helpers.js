const fs = require('fs')
const util = require('util')
const path = require('path')
const { config } = require('../config.js')
const SolidityParser = require('solidity-parser')
const Table = require('cli-table2')

let readdir = util.promisify(fs.readdir)
let appendFile = util.promisify(fs.appendFile)
let readFile = util.promisify(fs.readFile)
let writeFile = util.promisify(fs.writeFile)
let unlink = util.promisify(fs.unlink)

function toTimestamp(date){
  var timestamp = Date.parse(date);
  return Math.floor(timestamp / 1000);
}

function getContractName(filePath) {
	return path.basename(filePath, '.sol')
}

function getContractPath(contractName) {
  return config.contractsFolder + contractName + '.sol'
}

async function getContracts() {
  let contracts = await readdir(config.contractsFolder)
  return contracts
}

async function getContractPaths() {
  let contracts = await readdir(config.contractsFolder)
  let contractPaths = contracts.map(function(contract) {
    return config.contractsFolder + contract
  })
  return contractPaths
}

async function getContractImports(contractName) {
  let fileContents = await readFile(config.contractsFolder + contractName, 'utf-8')
  let imports = SolidityParser.parse(fileContents, "imports")
  return imports
}

//TODO check for string and proper format
async function getContractNames() {
  let contracts = await readdir(config.contractsFolder)
  let contractNames = contracts.map((contract) => { return contract.substring(0, contract.length-4)})
  return contractNames
}

//TODO differentiate whether the input is absolute, relative, or just a name
function getContractBasename(file) {
  return file.capitalize() + '.sol'
}

//TODO clean
function getTable(json) {

  let table = new Table();
  let keys = Object.keys(json)

  keys.forEach(function(key) {
    let row = {}
    row[key] = json[key]
    table.push(row)
  });

  return table.toString()
}


module.exports = {
  readdir,
  appendFile,
  readFile,
  writeFile,
  unlink,
  toTimestamp,
  getContractName,
  getContracts,
  getContractNames,
  getContractPaths,
  getContractImports,
  getContractBasename,
  getTable
}