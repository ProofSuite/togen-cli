module.exports = () =>
`
event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
event Finalized();
`