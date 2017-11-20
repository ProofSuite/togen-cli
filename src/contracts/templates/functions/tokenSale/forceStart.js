module.exports = () =>
`
function forceStart() public onlyOwner returns (bool) {
  started = true;
  return true;
}
`