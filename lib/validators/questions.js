/**
 * Checks if the address is a valid. Accepts checksummed addresses too
 * @param {String} address
 * @return {Boolean}
 */
const isValidAddress = function (address) {
  if(/^0x[0-9a-fA-F]{40}$/i.test(address)) {
    return true
  } else {
    return 'Please enter a valid ethereum address'
  }
}


//TODO must find a cleaner way to check if the number entered is an integer (right now it simply converts floats to int)
const isValidTokenNumber = function (value) {
  value = parseInt(value)
  if (!Number.isInteger(value) || value <= 0) {
    return 'Please enter a valid token number (must be a strictly positive integer)'
  }
  else {
    return true
  }
}

const isValidTokenType = function (value) {
  let tokenTypes = ['ERC20', 'MINIME']
  if (tokenTypes.indexOf(value) != -1) {
    return true
  } else {
    return 'Please enter a valid token standard'
  }
}

const isValidCap = function (value) {
  value = parseInt(value)
  if (!Number.isInteger(value) || value <= 0) {
    return 'Please enter a valid cap (must be a strictly positive integer)'
  }
  else {
    return true
  }
}

const isValidSymbol = function(value) {
  if (!/([A-Z]+){2-6}/i.test(value)) {
    return true
  } else {
    return 'Please enter a valid symbol value (only uppercase letters)'
  }
}

const isValidDecimals = function(value) {
  value = parseInt(value)
  if (!Number.isInteger(value) || value < 0 || value > 18) {
    return 'Please enter a value decimals number (must be an integer between 0 and 18)'
  } else {
    return true
  }
}

const isValidName = function(value) {
  if (!String(value) || value.length > 40) {
    return 'Please enter a valid name (must be less than 40 characters)'
  } else {
    return true
  }
}

const isPositiveNumber =function(value) {
  if (parseInt(value) != NaN && value >= 0) {
    return true;
  } else {
    return 'Please enter a positive number'
  }
}

const isStrictlyPositiveNumber = function(value) {
  if (parseInt(value) != NaN && value > 0) {
    return true;
  } else {
    return 'Please enter a strictly'
  }
}

const isString = function(value) {
  if (typeof value == "string") {
    return true;
  } else {
    return 'The value must be a string'
  }
}

const isNumber = function(value) {
  if (typeof value == "number") {
    return true
  } else {
    return 'Please enter a valid number'
  }
}

const isBoolean = function(value) {
  if (typeof value == "boolean") {
    return true
  } else {
    return 'Please enter a boolean value (true or false)'
  }
}

const validateType = function(type, value) {
  switch(type) {
    case "bool":
        return isBoolean(value)
    case "address":
        return isValidAddress(value)
    case "uint256":
        return isPositiveNumber(value)
    }
}


module.exports = {
  isString,
  isPositiveNumber,
  isValidAddress,
  isValidSymbol,
  isValidName,
  isStrictlyPositiveNumber,
  isValidTokenNumber,
  isValidCap,
  isValidDecimals,
  isValidTokenType,
  isNumber,
  isBoolean,
  validateType
}





