

# togen : Token and Token Sale Generator CLI (Beta)


The togen Token Sale Generator CLI is an commandline tool to configure, generate, compile and deploy tokensale smart-contract infrastructures.




## Modules


**Configure Contracts**

Choose which contracts you will be assembling, compiling and deploying. Answer the different questions to configure tokensale parameters (number of tokens, cap, etc.)


**Display Contract Configuration**

Quickly visualize which contracts are included and their configuration


**Assemble Contracts**

Instantly generate solidity code corresponding your tokensale configuration. You need to finish configuration before proceeding to build your contracts.


**Compile Contracts (under development)**

Compile the contracts into bytecode.


**Deploy Contracts (under development)**

Deploy contracts via your own client or simply use Infura to seamlessly deploy contracts to the network of your choice


## Requirements

* OSX or Linux (Windows support planned)
* Node (version 8.7.0 required for the testing environment)



## Install

An early version of the module has been published via npm. It is however an early release and we recommend using the development version of the CLI to be able to benefit from the latest changes.

To install the npm published version:

```
npm install -g togen
```

To install the developer version with the latest changes:

* Clone the package

```
git clone https://github.com/ProofSuite/TokenSaleGeneratorCLI
```

* Install the package globally

```
cd TokenSaleGeneratorCLI
npm install -g .
```


## Usage

Create your togen folder (creates a local directory with the required smart-contracts dependencies and settings files).

```
togen init --name togen-folder
cd togen-folder
```

List of the togen sub-commands:

   **Initialize a togen directory**

   > `togen init [--name <name>]`
   >* --name: Enter togen folder name (optional)


   **Open an interactive togen session**

   > `togen console`


   **Configure contract parameters:**

   > `togen configure [ --show |--edit | --interactive ] [ --file <file> | --default ]`
   > * --show: Show configuration (from current project, file or default configuration)
   > * --edit: Edit configuration. If the file option is used, the file configuration will replace the project configuration
   > * --interactive: Edit configuration interactively


 **Assemble contract templates**

 > `togen assemble [--file <filepath>] [--contracts <names>] [--output <path>] [ --print ]`
 > * --file: Assemble contract from file configuration (if the file is not provided, the configuration will be current project configuration)
 > * --contracts: Only assemble the provided contracts (the settings file is still required)
 > * --output: Outputs the resulting solidity code to the given path

**Compile one or several smart contracts**

 > `compile [--file filepath] [--contract <names>] [--output <path>] [--bytecode | --interface]`
 > * --file: Compiles contract from file configuration (if the file is not provided, the configuration will be the current project configuration)
 > * --contracts: Only compiles the provided contracts (the settings file is still required)
 > * --output: Outputs the resulting compile information to the given path
 > * --bytecode: Print contracts bytecode
 > * --interface: Print contracts interface




## Examples

Show current configuration
```
togen configure --show
```

Show file configuration
```
togen configure --show --file <path/to/file.json>
```

Show the default configuration
```
togen configure --show --default
```

Edit your configuration interactively
```
togen configure --edit
```

Edit your configuration with a settings file
```
togen configure --edit --file <path/to/file.json>
```

Open interactive togen console
```
togen console
```

Assemble contracts (local configuration)
```
togen assemble
```

Assemble contracts from a specific configuration file
```
togen assemble --file <path/to/settings.json>
```


Assemble a specific contract within your configuration (local configuration)
```
togen assemble --contracts Presale
```

Compile local configuration/contracts
```
togen compile
```

Assemble and compile from a specific configuration file
```
togen assemble --file <path/to/settings.json>
```


## Current Features

The togen token/tokensale generator CLI project is still in its infancy. Here are the current features for both tokensale and token contracts:

Tokens:

* Token Name
* Token Symbol
* Token Decimals
* Token Standard (ERC20, MINIME. The next step is to included ERC223 + Open Zeppelin additional personalization)
* Allow transfers or not
* Allow locking transfers or not


Tokensale:

* Token Price
* Minimum Investment
* Tokensale Wallet
* Tokensale starting/ending date
* Tokensale Cap
* Token Balance/Supply proxy
* etc.


Planned Features:
- select very different types of contract
- more complex deployments ?
- inspect list of transactions for a wallet (and link to etherscan)
- put contract from the editor (deployment arguments ? - from the command line)
- make sure deployment works for contracts with constructor arguments
- create a system where the deployer records the contracts that have been deployed.
  the deployment menu shows the contracts that have been compiled. each contracts leads
  to a submenu. if a contract has been compiled in the past, it shows a deployed list of contracts
  with links to etherscan. if not, a simple "has not been compiled yet"
- fix the options and settings wording (+ maybe additional fileSettings?)
- add a message that the previous configuration has been loaded. + figure out the save configuration flow



## Contributing

The togen project is fully open-sourced and we welcome any contributions, even the smallest





























