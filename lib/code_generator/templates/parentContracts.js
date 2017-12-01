require('../../utils.js')

module.exports = (contracts) => {
  let parentContracts = Object.keys(contracts).capitalize()
  return `${parentContracts.join(', ')}`
}