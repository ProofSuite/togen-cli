module.exports = () =>
`
/**
 * Enable or block transfers - to be called in case of emergency
 * @param _value {bool}
*/
function enableTransfers(bool _value) public onlyController {
  transfersEnabled = _value;
}
`