const fs = require('fs')
const Lightwallet = require('eth-lightwallet')
const ProviderEngine = require('web3-provider-engine')

const NonceSubProvider = require('web3-provider-engine/subproviders/nonce-tracker')
const FilterProvider = require('web3-provider-engine/subproviders/filters')
const RpcSubprovider = require('./rpc_subprovider')
const LightwalletSubprovider = require('./lightwallet_subprovider')


class LightwalletProvider {

  constructor(opts) {
    this.opts = opts;
  }

  init(cb) {
    if (this.initialized) { return cb(); }
    this.initialized = true;
    this.opts.serialized = fs.readFileSync(this.opts.keystore).toString();
    this.opts.ks = Lightwallet.keystore.deserialize(this.opts.serialized);
    this.opts.addresses = this.opts.ks.getAddresses().map(a => `${a}`);

    const { pollingInterval } = this.opts;
    console.log("POLLING INTERVAL", pollingInterval)
    this.engine = new ProviderEngine({ pollingInterval });
    this.engine.addProvider(new FilterProvider());
    this.engine.addProvider(new NonceSubProvider());
    this.engine.addProvider(new LightwalletSubprovider(this.opts));
    this.engine.addProvider(new RpcSubprovider(this.opts));

    this.engine.start();
    return cb();
  }

  send() {
    throw new Error('`send` is not supported; use `sendAsync`');
  }

  sendAsync(...args) {
    return this.init(() => {
      return this.engine.sendAsync(...args);
    });
  }

}

module.exports = LightwalletProvider