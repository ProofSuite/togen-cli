const validator = require('./validators/questions.js')
const networks  = require('./constants').NETWORKS


const categories = {
  type: 'list',
  name: 'choice',
  message: 'Select Action',
  choices: ['Configure Contracts', 'Configure Account', 'Display Contract Configuration', 'Build Contracts', 'Compile Contracts', 'Deploy Contracts', 'Close']
}

const configurationMenu = ({additionalFields = []}) => {
  let choices = ['Edit Configuration', 'Display Current Configuration', 'Load Previous Configuration', 'Save Configuration']
  choices = choices.concat(additionalFields)
  return {
    type: 'list',
    name: 'choice',
    message: 'Choose different configuration options',
    choices: choices
  }
}

const compilerMenu = ({additionalFields = []}) => {
  let choices = ['Compile All Contracts', 'Compile Contract']
  choices = choices.concat(additionalFields)
  return {
    type: 'list',
    name: 'choice',
    message: 'Select Action',
    choices: choices
  }
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

const walletList = (list = []) => {
  return {
    type: 'list',
    name: 'address',
    message: 'Select Wallet',
    choices: list
  }
}

const list = (list = [], message = '') => {
  return {
    type: 'list',
    name: 'choice',
    message: message,
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

const accountConfigurationMenu = ({additionalFields = []}) => {
  let choices = ['Create new ethereum wallet', 'List ethereum wallets', 'Delete wallet', 'Expose ethereum wallet private keys']
  choices = choices.concat(additionalFields)

  return {
    type: 'list',
    name: 'choice',
    message: 'Choose between the following actions to configure your account',
    choices: choices
  }
}

const deployerConfigurationMenu = ({additionalFields = []}) => {
  let choices = ['Show deployment settings', 'Update deployment settings', 'Deploy']
  choices = choices.concat(additionalFields)

  return {
    type: 'list',
    name: 'choice',
    message: 'Choose between the following actions to configure your deployment',
    choices: choices
  }
}

const deployerSettingsMenu = ({additionalFields = []}) => {
  let choices = ['Show deployment settings', 'Default Network/Wallet', 'Configure Infura Token', 'Configure Gas Options']
  choices = choices.concat(additionalFields)

  return {
    type: 'list',
    name: 'choice',
    message: 'Choose between the following actions to configure your deployment',
    choices: choices
  }
}

const deployMenu = (additionalFields = []) => {
  let choices = ['Select deployment settings']
}

const createWallet = [
  {
    type : 'input',
    name : 'name',
    message : 'Choose a name for your wallet',
    validate: validator.isValidName
  },
  {
    type : 'password',
    name : 'password',
    message : 'Type a password for your wallet'
  },
  {
    type : 'list',
    name : 'network',
    message : 'Enter on which network you wish to use this wallet',
    choices : networks
  }
];

const deleteWallet = (wallets) => {
  return {
    type: 'list',
    name: 'address',
    message: 'Select the wallet you want to delete',
    choices: wallets.map((wallet) => { return `${wallet.address} (Network: ${wallet.network} - Name: ${wallet.name})`}),
    filter: (str) => { return str.substring(0,42) }
  }
}

const defaultWalletForm = (wallets) => {
  return {
    type: 'list',
    name: 'defaultAddress',
    message: 'Select default wallet',
    choices: wallets.map((wallet) => { return `${wallet.address} (Network: ${wallet.network} - Name: ${wallet.name})`}),
    filter: (str) => { return str.substring(0,42) }
  }
}

const exposePrivateKeys = (wallets) => {
  return {
    type: 'list',
    name: 'address',
    message: 'Select wallet',
    choices: wallets.map((wallet) => { return `${wallet.address} (Network: ${wallet.network} - Name: ${wallet.name})`}),
    filter: (str) => { return str.substring(0,42) }
  }
}


const walletPassword = [
  {
    type : 'password',
    name : 'password',
    message : 'Enter the password corresponding to this wallet',
  }
]

const gasOptionsForm = [
  {
    type : 'input',
    name : 'gasLimit',
    message : 'Enter Gas Limit (Mwei) - default: 4Mwei',
    validate: validator.isPositiveNumber
  },
  {
    type : 'input',
    name : 'gasPrice',
    message : 'Enter Gas Price (Gwei) - default: 20Gwei',
    validate: validator.isPositiveNumber
  }
]

const defaultNetworkForm = {
  type : 'list',
  name : 'network',
  message : 'Enter default network',
  choices : networks
}

const confirmExposePrivateKey = [
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Confirm to display this private key'
  }
]

const infuraTokenForm = {
    type: 'input',
    name: 'token',
    message: 'Input your infura token. You can obtain your infura token at: https://infura.io\n'
}


const constructorArgumentsForm = (params) => {
  let form = []
  for (let param of params) {
    let prompt = {
      type: 'input',
      name: param.name,
      message: `Input parameter value for ${param.name} (type: ${param.type})`,
      validate: function(value) {
        return validator.validateType(param.type, value)
      }
    }
    form.push(prompt)
  }

  return form
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
  contractConfigurationMenu,
  accountConfigurationMenu,
  deployerSettingsMenu,
  deployerConfigurationMenu,
  confirmExposePrivateKey,
  createWallet,
  walletList,
  walletPassword,
  defaultNetworkForm,
  defaultWalletForm,
  gasOptionsForm,
  infuraTokenForm,
  constructorArgumentsForm,
  deleteWallet,
  exposePrivateKeys
}