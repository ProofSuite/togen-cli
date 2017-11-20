module.exports = () =>
`
function enableTransfers() public returns (bool) {
  token.enableTransfers(true);
  return true;
}

function lockTransfers() public onlyOwner returns (bool) {
  token.enableTransfers(false);
  return true;
}
`