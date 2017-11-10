# Token Sale Generator CLI (Beta)

The Token Sale Generator CLI is an commandline tool to configure, generate, compile and deploy tokensale smart-contract infrastructures.

### Requirements

* OSX or Linux (Windows support planned)
* Node (version 8.7.0 required for the testing environment)


### Install

After you've installed the correct version of node, install local node packages:

```
npm install
```

### Usage

Simply run the command line utility with npm:

```
npm run start
```

### Modules

* Configure Contracts
Choose which contracts you will be assembling, compiling and deploying. Answer the different questions to configure tokensale parameters (number of tokens, cap, etc.)

* Display Contract Configuration
Quickly visualize which contracts are included and their configuration

* Build Contracts
Instantly generate solidity code corresponding your tokensale configuration. You need to finish configuration before proceeding to build your contracts.

* Compile Contracts (under development)
Compile the contracts into bytecode.

* Deploy Contracts (under development)
Deploy contracts via your own client or simply use Infura to seamlessly deploy contracts to the network of your choice


### Contributing

The Token Sale Generator CLI project is still in its infancy. We welcome even the smallest contributions.

Below is a short and non-exhaustive list of features that we wish to add

* Code style:
- Replace hardcoded values by importing them from the config file
- Normalize file paths to account for windows
- Re-organize modules
- promiseAll instead of sequential awaits
- etc.

* Tests:
- Write unit tests

* Flow:
- Improved flow (take into account the additional complexity from upcoming features)
- Delete solidity on generation of new files
- Replace hardcoded filenames by a directory lookup

* Validations:
- Improved validation patterns based on regular expressions
- Improved validation based on logic (startDate < endDate)

* Smart-Contracts:
- Add different models of token sale (capped, uncapped, dutch auction, etc.)
- Add different models of tokens (standard minted token, simple ERC20 token, non-transferable token)
- Add modularity based on smart-contract inheritance (Ownable, Controllable, etc.)

* Display:
- Add visual cues on whether a configuration is complete or incomplete (green check/red cross)
- Improve messages/visuals

* Configuration:
- Save and Load smart-contract configuration

* Token and Presale Token:
- Non-transferable token configuration
- Lockable transfers configuration
- Approve/Call configuration
- Mintable or pre-generated

* Compilation:
- Integrate compilation module to the rest of the CLI
- Integrate flattening module to the compilation
- Flattening (=replacing imports by files) should be graph-based (e.g. imports shouldn)'t have to be in the right order to compile correctly)
- Add support for constructor arguments

* Presale and Tokensale:
- Ending date and starting date options for the presale
- Initial Token Allocation Configuration
- Price bonuses
- etc.

* Deployment:
- Flexible deployment module based on truffle-deployer
- Automatic transfer of the token control to the tokensale

* Bugs:
- Currently there is a bug when doing a configuration and going to the configuration menu a second time, the output is displayed twice

