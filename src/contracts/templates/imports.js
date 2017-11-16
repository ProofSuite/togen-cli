//TODO fix line skipping bug
//TODO refactor
module.exports = (imports) =>
`
  ${imports.safeMath ? `import './dependencies/SafeMath.sol'` : ``}
  ${imports.ERC20 ? `import './dependencies/ERC20.sol'` : ``}
  ${imports.ownable ? `import './dependencies/Ownable.sol'` : ``}
  ${imports.pausable ? `import './dependencies/Pausable.sol'`: `` }
  ${imports.controllable ? `import './dependencies/Controllable.sol'` : ``}
  ${imports.tokenInterface ? `import './dependencies/TokenInterface.sol'` : ``}
  ${imports.approveCall ? `import './dependencies/ApproveAndCallReceiver.sol'` : ``}
`