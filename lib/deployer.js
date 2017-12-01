//Just some sample code


let TestRPC = require("ethereumjs-testrpc")
let contract = require("truffle-contract")
let Deployer = require("truffle-deployer")
let Web3 = require("web3")

var provider = TestRPC.provider();

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

function deployContract() {

  let network_id = await web3.eth.getId()
  let accounts = await web3.eth.getAccounts()

  let ContractAbs = contract({
    contract_name: "Ownable",
    unlinked_binary: bytecode,
    abi: abi
  });

  Contract.setProvider(provider)

  var deployer = new Deployer({
    contracts: [Example],
    network: "test",
    network_id: network_id,
    provider: provider
  })

  var errored = false;

  Contract.defaults({
    gas: 4 * 10 ** 6,
    from: accounts[0]
  })

  deployer.deploy(Contract)

  return deployer.start().then(function() {
    console.log(Contract.address)
  });


}