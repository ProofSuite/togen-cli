const SignerProvider = require('eth-js-provider-signer')
const sign = require('ethjs-signer')

const provider = new SignerProvider('https://ropsten.infura.io', {
  signTransaction: (rawTx, cb) => cb(null, pk)
})

