class WalletOptions {

    constructor(options) {
      this.isMultiSig = options.isMultiSig;
    }

    isComplete() {
      return (typeof(this.multisig) === "boolean")
    }

  }

  module.exports = WalletOptions