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

const tokenType = {
  type: 'list',
  name: 'choice',
  message: 'Select Type of Token',
  choices: ['MINIME', 'ERC20']
}

const tokenSaleAdditionalConfiguration = [
  {
    type : 'confirm',
    name : 'advancedCustomization',
    message : 'You can choose to configure advanced options or leave them to default',
    choices : ['Default', 'Custom']
  },
  {
    type : 'confirm',
    name : 'contributors',
    message : 'Show contributors ?',
    when: function(answers) {
      return (answers.advancedCustomization == 'Custom')
    },
    default: true
  },
  {
    type : 'confirm',
    name : 'updateableController',
    message: 'Possibility to update the token sale controller',
    when: function(answers) {
      return (answers.advancedCustomization == 'Custom')
    },
    default: false
  },
  {
    type: 'confirm',
    name: 'proxy',
    message: 'Display proxy balance and proxy total supply of corresponding token ?',
    when: function(answers) {
      return (answers.advancedCustomization == 'Custom')
    },
    default: true
  },
]


const tokenSale = [
  {
    type : 'input',
    name : 'tokenPrice',
    message : 'Please input token price (in wei)',
    validate: validator.isPositiveNumber
  },
  {
    type: 'datetime',
    name : 'startTime',
    message: 'Please input beginning date',
    format: ['m', '/', 'd', '/', 'yy', ' ', 'h', ':', 'MM', ' ', 'TT']
  },
  {
    type : 'datetime',
    name : 'endTime',
    message : 'Please input ending date',
    format: ['m', '/', 'd', '/', 'yy', ' ', 'h', ':', 'MM', ' ', 'TT']
  },
  {
    type : 'input',
    name : 'wallet',
    message : 'Please input ethereum wallet address (to which tokensale funds will be forwarded)',
    validate: validator.isValidAddress
  }
]

const tokenSaleType = [
  {
    type: 'list',
    name: 'type',
    message: 'Select type of Tokensale',
    choices: ['Capped', 'Uncapped']
  },
  {
    type: 'input',
    name: 'cap',
    message: 'Input tokensale cap',
    validate: validator.isValidCap,
    when: function(answers) {
      return (answers.type == 'Capped')
    }
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
    name: 'minimumInvestment',
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
  tokenType,
  tokenSaleType,
  tokenSaleAdditionalConfiguration
}