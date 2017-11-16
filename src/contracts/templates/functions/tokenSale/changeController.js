module.exports = (params) => `
/**
 * Change the Token controller
 * @param _newController {address} New Token controller
 */
 function changeController(address _newController) onlyOwner public returns (bool) {
   token.transferControl(_newController);
   return true;
 }
 `

