/**
 * Checks if the address is a valid. Accepts checksummed addresses too
 * @param {String} address
 * @return {Boolean}
 */
const isValidAddress = function (address) {
  if(/^0x[0-9a-fA-F]{40}$/i.test(address)) {
    return true
  } else {
    return false
  }
}


//TODO must find a cleaner way to check if the number entered is an integer (right now it simply converts floats to int)
const isValidTokenNumber = function (value) {
  value = parseInt(value)
  if (!Number.isInteger(value) || value <= 0) {
    return false
  }
  else {
    return true
  }
}

const isValidTokenStandard = function (value) {
  let tokenTypes = ['ERC20', 'MINIME']
  return (tokenTypes.indexOf(value) != -1)
}

const isNetwork = function(value) {
  let networks = ['mainnet', 'ropsten', 'rinkeby']
  return (networks.indexOf(value) != -1)
}

const isValidCap = function (value) {
  value = parseInt(value)
  if (!Number.isInteger(value) || value <= 0) {
    return false
  }
  else {
    return true
  }
}

const isValidSymbol = function(value) {
  if (!/([A-Z]+){2-6}/i.test(value)) {
    return true
  } else {
    return false
  }
}

const isValidDecimals = function(value) {
  value = parseInt(value)
  if (!Number.isInteger(value) || value < 0 || value > 18) {
    return false
  } else {
    return true
  }
}

const isValidName = function(value) {
  if (!String(value) || value.length > 40) {
    return false
  } else {
    return true
  }
}

const isPositiveNumber =function(value) {
  if (parseInt(value) != NaN && value >= 0) {
    return true;
  } else {
    return false
  }
}

const isStrictlyPositiveNumber = function(value) {
  if (parseInt(value) != NaN && value > 0) {
    return true;
  } else {
    return false
  }
}

const isString = function(value) {
  if (typeof value == "string") {
    return true;
  } else {
    return false
  }
}

const isNumber = function(value) {
  if (typeof value == "number") {
    return true
  } else {
    return false
  }
}

const isBoolean = function(value) {
  if (typeof value == "boolean") {
    return true
  } else {
    return false
  }
}

const isObject = function(value) {
  return (typeof(value) === 'object')
}

const isNonEmptyObject = function(value) {
  return (typeof(value) === 'object' && value != {})
}

const isSet = function() {
  return !(Object.keys(obj).length === 0 && obj.constructor === Object)
}

const isTrue = function(value) {
  return (value)
}

const isValidEthereumAddress = function (address) {
  if(/^0x[0-9a-fA-F]{40}$/i.test(address)) {
    return true
  } else {
    return false
  }
}

const hasValidTimeLimits = function (startTime, endTime) {
  if (startTime < 0) return false
  if (endTime < startTime) return false

  return true
}

const isWalletType = function(value) {
  let tokenTypes = ['wallet', 'multisig']
  return (tokenTypes.indexOf(value) != -1)
}



module.exports = {
  isString,
  isPositiveNumber,
  isValidAddress,
  isValidSymbol,
  isValidName,
  isValidTokenNumber,
  isValidCap,
  isValidDecimals,
  isValidEthereumAddress,
  isStrictlyPositiveNumber,
  isValidTokenStandard,
  isSet,
  isWalletType,
  isTrue,
  isNumber,
  isBoolean,
  isObject,
  isNonEmptyObject,
  hasValidTimeLimits,
  isNetwork
}





