const fs = require('fs-extra')
const util = require('util')
const path = require('path')
const SolidityParser = require('solidity-parser')
const Table = require('cli-table2')

const Config = require('./config/index.js')
const Logger = require('./logger')

let readdir = util.promisify(fs.readdir)
let appendFile = util.promisify(fs.appendFile)
let readFile = util.promisify(fs.readFile)
let writeFile = util.promisify(fs.writeFile)
let unlink = util.promisify(fs.unlink)
let exists = util.promisify(fs.exists)
let access = util.promisify(fs.access)
let config = new Config();
let logger = new Logger();
let createKeccakHash = require('keccak')

const until = require('catchify')


async function fileExists(filePath) {
  var [error, result] = await until(access(filePath))

  if (!error) {
    return true
  }
  else {
    return false
  }
}

async function deleteFile(filePath) {
  var [error, result] = await until(access(filePath))
  if (!error) await unlink(filePath)
};

function toTimestamp(date){
  var timestamp = Date.parse(date);
  return Math.floor(timestamp / 1000);
}

function getContractName(filePath) {
	return path.basename(filePath, '.sol')
}

function getJSONName(filePath) {
  return path.basename(filePath, '.json')
}

//TODO take into account whether or not the contract name is camelized or not
function getContractPath(contractName) {
  let baseName = getContractBasename(contractName)
  let contractPath = path.join(config.contracts.solidity, baseName)
  return contractPath
}

function getContractsPath(contracts) {
  let paths = contracts.map(function(contract) { return getContractPath(contract) })
  return paths
}

function getFlattenedContractPath(contractName) {
  let baseName = getContractBasename(contractName)
  return path.join(config.contracts.flattened, baseName)
}


function getArtifactPath(contractName) {
  let baseName = contractName.camelize().capitalize() + '.json'
  let filePath = path.join(config.contracts.artifacts, baseName)
  return filePath
}

async function getContracts() {
  let contracts = await readdir(config.contracts.solidity)
  return contracts
}


function filterSolidityFiles(files) {
  return files.filter((file) => { return path.extname(file) === '.sol' })
}


async function getFlattenedContractPaths() {
  let files = await readdir(config.contracts.flattened)
  let contracts = filterSolidityFiles(files)

  let contractPaths = contracts.map(function(contract) {
    return path.join(config.contracts.flattened, contract)
  })

  return contractPaths
}

//TODO differentiate whether the input is absolute, relative, or just a name
function getContractBasename(file) {
  return file.camelize().capitalize() + '.sol'
}



function toChecksumAddress (address) {
  address = address.toLowerCase().replace('0x','');
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

//TODO clean
function getTable(json) {

  let table = new Table();
  let keys = Object.keys(json)

  keys.forEach(function(key) {
    let row = {}
    let formattedKey = key.uncamelize().capitalize()
    row[formattedKey] = json[key]
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
  getContractPath,
  getContractsPath,
  getContractBasename,
  getFlattenedContractPath,
  getFlattenedContractPaths,
  getArtifactPath,
  getJSONName,
  getTable,
  deleteFile,
  fileExists,
  toChecksumAddress
}