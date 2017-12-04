const validator = require('./validators/questions.js')

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
  choices: ['Edit Configuration', 'Display Current Configuration', 'Load Previous Configuration', 'Save Configuration', 'Back']
}

const compilerMenu = {
  type: 'list',
  name: 'choice',
  message: 'Select Action',
  choices: ['Compile All Contracts', 'Compile Contract', 'Print Bytecode', 'Print ABI', 'Copy Bytecode to clipboard', 'Copy API to clipboard']
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

const walletType = {
  type: 'list',
  name: 'choice',
  message: 'Select Type of Wallet',
  choices: ['Standard Wallet', 'Multisig']
}

const tokenMenu = {
  type: 'list',
  name: 'choice',
  message: 'Configure Token',
  choices: ['Base Configuration', 'Token Type', 'Advanced Configuration', 'Display Current Configuration', 'Back']
}

const tokenAdvancedConfiguration = [
  {
    type: 'list',
    name: 'advancedSettings',
    message: 'You can choose to configure advanced options or leave them to default',
    choices: ['Default', 'Custom']
  },
  {
    type: 'confirm',
    name: 'allowTransfers',
    message: 'This settings defines whether tokens can be transfered or not',
    when: function(answers) {
      return (answers.advancedSettings == 'Custom')
    }
  },
  {
    type: 'confirm',
    name: 'lockableTransfers',
    message: 'This settings defines whether token transfers can be locked or not',
    when: function(answers) {
      return (answers.advancedSettings == 'Custom' && answers.allowTransfers == true)
    }
  }
]

const tokenSaleMenu = {
  type: 'list',
  name: 'choice',
  message: 'Configure Tokensale',
  choices: ['Base Configuration', 'Cap Configuration', 'Timing Configuration', 'Advanced Configuration', 'Display Current Configuration', 'Back']
}

const walletMenu = {
  type: 'list',
  name: 'choice',
  message: 'Configure your wallet contract',
  choices: ['Wallet Type', 'Display Current Configuration', 'Back']
}

const tokenSaleAdvancedOptions = [
  {
    type : 'list',
    name : 'settings',
    message : 'You can choose to configure advanced options or leave them to default',
    choices : ['Default', 'Custom']
  },
  {
    type: 'confirm',
    name: 'finalizeable',
    message: 'Possibility to manually end the token sale',
    when: function(answers) {
      return (answers.settings == 'Custom')
    },
    default: true
  },
  {
    type: 'confirm',
    name: 'starteable',
    message: 'Possibility to manually start the token sale',
    when: function(answers) {
      return (answers.settings == 'Custom')
    },
    default: true
  },
  {
    type : 'confirm',
    name : 'contributors',
    message : 'Show contributors ?',
    when: function(answers) {
      return (answers.settings == 'Custom')
    },
    default: true
  },
  {
    type : 'confirm',
    name : 'allowTransferController',
    message: 'Possibility to update the token sale controller',
    when: function(answers) {
      return (answers.settings == 'Custom')
    },
    default: false
  },
  {
    type: 'confirm',
    name: 'lockableTransfers',
    message: 'This settings defines whether token transfers can be locked or not',
    when: function(answers) {
      return (answers.settings == 'Custom')
    }
  },
  {
    type: 'confirm',
    name: 'proxy',
    message: 'Display proxy balance and proxy total supply of corresponding token ?',
    when: function(answers) {
      return (answers.settings == 'Custom')
    },
    default: true
  }
]


const tokenSale = [
  {
    type : 'input',
    name : 'tokenPrice',
    message : 'Please input token price (in wei)',
    validate: validator.isPositiveNumber
  },
  {
    type: 'input',
    name : 'minimumInvestment',
    message : 'Please input minimum investment (0 to accept any transaction)',
    validate: validator.isPositiveNumber
  },
  {
    type : 'input',
    name : 'wallet',
    message : 'Please input ethereum wallet address (to which tokensale funds will be forwarded)',
    validate: validator.isValidAddress
  }
]

const tokenSaleCap = [
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

const tokenSaleTimeLimits = [
  {
    type: 'confirm',
    name: 'timed',
    message: 'Choose whether the tokensale is limited in time (recommended)',
    default: true
  },
  {
    type: 'datetime',
    name : 'startTime',
    message: 'Please input beginning date',
    format: ['m', '/', 'd', '/', 'yy', ' ', 'h', ':', 'MM', ' ', 'TT'],
    when: function(answers) {
      return (answers.timed == true)
    }
  },
  {
    type : 'datetime',
    name : 'endTime',
    message : 'Please input ending date',
    format: ['m', '/', 'd', '/', 'yy', ' ', 'h', ':', 'MM', ' ', 'TT'],
    when: function(answers) {
      return (answers.timed == true)
    }
  }
]


const advancedOptions = [
  {
    type: 'list',
    name: 'lockableTransfers',
    message: 'Choose whether the tokensale controller can lock the transfers or not',
    choices: ['Transfers can be locked', 'Transfers can not be locked']
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

const contractCheckboxList = (list) => {
  let  contractFiles = list || ['Presale', 'Presale Token', 'Token', 'Token Sale', 'Wallet'];
  return {
    type: 'checkbox',
    name: 'choice',
    message: 'Select Contract',
    choices: contractFiles
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

const contractConfigurationMenu = ({additionalFields = []}) => {
  let choices = ['Edit Configuration', 'Display Current Configuration', 'Load Previous Configuration', 'Save Configuration']
  choices = choices.concat(additionalFields)

  return {
    type: 'list',
    name: 'choice',
    message: 'Choose different configuration options',
    choices: choices
  }
}


module.exports = {
  token,
  tokenSale,
  wallet,
  categories,
  compilerMenu,
  configurationMenu,
  contractList,
  contractCheckboxList,
  contractOptionsList,
  tokenMenu,
  tokenSaleMenu,
  walletMenu,
  tokenType,
  walletType,
  tokenSale,
  tokenSaleCap,
  tokenSaleTimeLimits,
  advancedOptions,
  tokenSaleAdvancedOptions,
  tokenAdvancedConfiguration,
  contractConfigurationMenu
}