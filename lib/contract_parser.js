const SolidityParser = require("solidity-parser")

getContractCode = ({fileContents, filePath}) => {
  let fileBody
  if (filePath) {
    fileBody = SolidityParser.parseFile(filePath).body

  }
  else if (fileContents) {
    console.log("filecontents is set")
    fileBody = SolidityParser.parse(fileContents).body
  }

  return fileBody
}


//get import statements
getImportStatements = ({fileContents, filePath}) => {
  let imports = []
  const fileBody = getContractCode({fileContents, filePath})

  for (i in Object.keys(fileBody)) {
    if (fileBody[i].type == 'ImportStatement') {
      imports.push(fileBody[i].from)
    }
  }
}


getConstructorParameters = ({fileContents, filePath}) => {
  let args = []
  let paramNames, paramTypes
  const fileBody = getContractCode({fileContents, filePath})

  for (i in Object.keys(fileBody)) {
    if (fileBody[i].type == 'ContractStatement') {
      let contract = fileBody[i]
      let contractName = fileBody[i].name
      let contractBody = fileBody[i].body

      for (j in Object.keys(contractBody)) {
        if (contractBody[j].type == 'FunctionDeclaration' && contractBody[j].name == contractName) {
          if (contractBody[j].params) {
            let params = contractBody[j].params
            params.forEach((param) => {
              let name = param.id
              let type = param.literal.literal
              args.push({name: name, type: type})
            })
          }
        }
      }
    }
  }

  return args
}

getFunctionNames = ({fileContents = '', filePath = ''}) => {
  let functionNames = []
  const fileBody = getContractCode({fileContents, filePath})

  for (i in Object.keys(fileBody)) {
    if (fileBody[i].type == 'ContractStatement') {
      let contract = fileBody[i]
      let contractName = fileBody[i].name
      let contractBody = fileBody[i].body

      for (j in Object.keys(contractBody)) {
        if (contractBody[j].type == 'FunctionDeclaration') {
          let name = contractBody[j].name || 'FALLBACKFUNCTION'
          functionNames.push(name)
        }
      }
    }
  }

  return functionNames
}


getFunctionSignatures = ({fileContents, filePath}) => {
  let signatures = {}
  let paramNames, paramTypes

  const fileBody = getContractCode({fileContents, filePath})

  for (i in Object.keys(fileBody)) {
    if (fileBody[i].type == 'ContractStatement') {
      let contract = fileBody[i]
      let contractName = fileBody[i].name
      let contractBody = fileBody[i].body

      for (j in Object.keys(contractBody)) {
        let statement = contractBody[j]
        if (statement.type == 'FunctionDeclaration' && statement.name != contractName) {
          let func, functionName, params, paramNames, paramTypes

          func = contractBody[j]
          functionName = func.name || `FALLBACK FUNCTION`
          params = func.params

          if (params) {
            paramNames = params.map(param => { return param.id})
            paramTypes = params.map(param => { return param.literal.literal})
          }

          signatures[functionName] = {
            params: paramNames || "",
            types: paramTypes || ""
          }

        }
      }
    }
  }

  return signatures
}


getPublicFunctionSignatures = ({fileContents, filePath}) => {
  let publicSignatures = {}
  let paramNames, paramTypes

  const fileBody = getContractCode({fileContents, filePath})

  for (i in Object.keys(fileBody)) {
    if (fileBody[i].type == 'ContractStatement') {
      let contract = fileBody[i]
      let contractName = fileBody[i].name
      let contractBody = fileBody[i].body

      for (j in Object.keys(contractBody)) {
        let statement = contractBody[j]
        if (statement.type == 'FunctionDeclaration' && statement.name != contractName) {
          let func, functionName, params, paramNames, paramTypes, public

          func = contractBody[j]
          functionName = func.name || `FALLBACK FUNCTION`
          params = func.params
          modifiers = func.modifiers

          public = modifiers.some(modifier => { return (modifier.name == 'public') })

          if (params) {
            modifiers = params.map(param => { return })
            paramNames = params.map(param => { return param.id})
            paramTypes = params.map(param => { return param.literal.literal})
          }

          if (public) {
            publicSignatures[functionName] = {
              params: paramNames || "",
              types: paramTypes || ""
            }
          }
        }
      }
    }
  }

  return publicSignatures
}


module.exports = {
  getImportStatements,
  getConstructorParameters,
  getFunctionNames,
  getFunctionSignatures,
  getPublicFunctionSignatures
}