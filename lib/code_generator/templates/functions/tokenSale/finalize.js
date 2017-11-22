module.exports = () =>
`
function finalize() public onlyOwner returns (bool) {
  require(paused);

  token.finishMinting();
  Finalized();

  finalized = true;
  return true;
}

modifier whenNotFinalized() {
  require(!finalized);
  _;
}
`
