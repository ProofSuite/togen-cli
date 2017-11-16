module.exports = (params) =>
`
// fallback function to buy tokens
function() payable {
  buyTokens(msg.sender);
}
`