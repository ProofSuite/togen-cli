module.exports = () =>
`function forwardFunds() internal {
  wallet.transfer(msg.value);
}`