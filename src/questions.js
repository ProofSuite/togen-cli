const validator = require('./validators.js')

const categories = {
  type: 'list',
  name: 'choice',
  message: 'Select Action',
  choices: ['Configure Contracts', 'Display Contract Configuration', 'Build Contracts', 'Compile Contracts', 'Help', 'Close']
}

const configurationMenu = {
  type: 'list',
  name: 'choice',
  message: 'Select Action',
  choices: ['New Configuration', 'Display Current Configuration', 'Load Previous Configuration', 'Save Configuration', 'Back']
}

const compilerMenu = {
  type: 'list',
  name: 'choice',
  message: 'Select Action',
  choices: ['Compile All Contracts', 'Compile Contract', 'Print Bytecode', 'Print ABI', 'Copy Bytecode to clipboard', 'Copy API to clipboard']
}

const returnToMenu = {
  type: 'list',
  name: 'choice',
  message: ' ',
  choices: ['Go back']
}

//TODO replace validator.isPositiveNumber by validator.isDecimals (which is somehow not working)
const token = [
  {
    type : 'input',
    name : 'name',
    message : 'Please input token name',
    validate: validator.isValidName
  },
  {
    type : 'input',
    name : 'symbol',
    message : 'Please input token symbol',
    validate: validator.isValidSymbol
  },
  {
    type : 'input',
    name : 'decimals',
    message : 'Please input token decimals',
    validate: validator.isPositiveNumber
  }
];


const tokenSale = [
  {
    type : 'input',
    name : 'cap',
    message : 'Please input token hard cap',
    validate: validator.isValidCap
  },
  {
    type : 'input',
    name : 'tokenPrice',
    message : 'Please input token price (in wei)',
    validate: validator.isPositiveNumber
  },
  {
    type: 'datetime',
    name : 'startDate',
    message: 'Please input beginning date',
    format: ['m', '/', 'd', '/', 'yy', ' ', 'h', ':', 'MM', ' ', 'TT']
  },
  {
    type : 'datetime',
    name : 'endDate',
    message : 'Please input ending date',
    format: ['m', '/', 'd', '/', 'yy', ' ', 'h', ':', 'MM', ' ', 'TT']
  },
  {
    type : 'input',
    name : 'etherWallet',
    message : 'Please input ethereum wallet address (to which tokensale funds will be forwarded)',
    validate: validator.isValidAddress
  }
]


const presale = [
  {
    type : 'input',
    name : 'cap',
    message : 'Please input token hard cap',
    validate: validator.isValidCap
  },
  {
    type: 'input',
    name: 'minInvestment',
    message: 'Please input minimum investment (in wei)',
    validate: validator.isPositiveNumber
  },
  {
    type : 'input',
    name : 'rate',
    message : 'Please input token rate (number of tokens received per ether)',
    validate: validator.isPositiveNumber
  },
  {
    type : 'input',
    name : 'wallet',
    message : 'Please input ethereum wallet address (to which tokensale funds will be forwarded)',
    validate: validator.isValidAddress
  }
]

const wallet = [
  {
    type: 'confirm',
    name: 'multisig',
    message: 'Do you want to create a multisig wallet to receive token sale funds?',
    default: false
  }
]


const compilation = {
  type: 'list',
  name: 'choice',
  message: 'Select option category',
  choices: ['Compile All Contracts', 'Compile Contract', 'Get Contract Bytecode', 'Get Contract Interface']
}

const contractList = (list = []) => {
  return {
    type: 'list',
    name: 'choice',
    message: 'Select Contract',
    choices: list
  }
}

const contractCheckboxList = (list = []) => {
  return {
    type: 'checkbox',
    name: 'choice',
    message: 'Select Contract',
    choices: list
  }
}

//TODO refactor the names 'list' and 'choice'
const contractOptionsList = (list = []) => {
  return {
    type: 'list',
    name: 'choice',
    message: 'Configure the following contracts',
    choices: list
  }
}


module.exports = {
  token,
  tokenSale,
  presale,
  wallet,
  categories,
  compilerMenu,
  configurationMenu,
  contractList,
  contractCheckboxList,
  contractOptionsList,
  returnToMenu
}