const fs = require('fs')
const util = require('util')
const path = require('path')
const config = require('../config.js')
const SolidityParser = require('solidity-parser')
const Table = require('cli-table2')

let readdir = util.promisify(fs.readdir)
let appendFile = util.promisify(fs.appendFile)
let readFile = util.promisify(fs.readFile)
let writeFile = util.promisify(fs.writeFile)
let unlink = util.promisify(fs.unlink)


async function deleteFile(filePath) {
  fs.stat(filePath, async function(err, stat) {
    if(err == null) {
      await unlink(filePath)
    }
  })
};

function toTimestamp(date){
  var timestamp = Date.parse(date);
  return Math.floor(timestamp / 1000);
}

function getContractName(filePath) {
	return path.basename(filePath, '.sol')
}


//TODO take into account whether or not the contract name is camelized or not
function getContractPath(contractName) {
  let baseName = getContractBasename(contractName)
  return path.join(config.outputFolder, baseName)
  return config.outputFolder + contractName + '.sol'
}

function getFlattenedContractPath(contractName) {
  let baseName = getContractBasename(contractName)
  return path.join(config.flattenedContractsOutput, baseName)
}

async function getContracts() {
  let contracts = await readdir(config.outputFolder)
  return contracts
}

function getArtifactPath(contractName) {
  let baseName = contractName.camelize().capitalize() + '.json'
  let filePath = path.join(config.artifactsFolder, baseName)
  return filePath
}



function filterSolidityFiles(files) {
  return files.filter((file) => { return path.extname(file) === '.sol' })
}

async function getContractPaths() {
  let files = await readdir(config.outputFolder)
  let contracts = filterSolidityFiles(files)

  let contractPaths = contracts.map(function(contract) {
    return config.outputFolder + contract
  })

  return contractPaths
}

async function getFlattenedContractPaths() {
  let files = await readdir(config.flattenedContractsOutput)
  let contracts = filterSolidityFiles(files)

  let contractPaths = contracts.map(function(contract) {
    return config.flattenedContractsOutput + contract
  })

  return contractPaths
}



async function getContractImports(contractName) {
  let fileContents = await readFile(config.outputFolder + contractName, 'utf-8')
  let imports = SolidityParser.parse(fileContents, "imports")
  return imports
}

//TODO check for string and proper format
async function getContractNames() {
  let contracts = await readdir(config.outputFolder)
  let contractNames = contracts.map((contract) => { return contract.substring(0, contract.length-4)})
  return contractNames
}

//TODO differentiate whether the input is absolute, relative, or just a name
function getContractBasename(file) {
  return file.camelize().capitalize() + '.sol'
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
  getContractPath,
  getContractImports,
  getContractBasename,
  getFlattenedContractPath,
  getFlattenedContractPaths,
  getArtifactPath,
  getTable,
  deleteFile
}