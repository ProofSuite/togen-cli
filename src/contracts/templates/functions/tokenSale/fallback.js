module.exports = (params) =>
`
  // fallback function to buy tokens
  function() public payable
  {
    buyTokens(msg.sender);
  }
`