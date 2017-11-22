module.exports = () =>
`
function transfer(address _to, uint _value) public returns (bool) {
  balances[msg.sender] = balances[msg.sender].sub(_value);
  balances[_to] = balances[_to].add(_value);

  Transfer(msg.sender, _to, _value);
  return true;
}

function transferFrom(address _from, address _to, uint _value) public returns (bool) {
  var _allowance = allowed[_from][msg.sender];

  balances[_to] = balances[_to].add(_value);
  balances[_from] = balances[_from].sub(_value);
  allowed[_from][msg.sender] = _allowance.sub(_value);

  Transfer(_from, _to, _value);
  return true;
}

function approve(address _spender, uint _value) public returns (bool) {
  allowed[msg.sender][_spender] = _value;
  Approval(msg.sender, _spender, _value);
  return true;
}

function allowance(address _owner, address _spender) public constant returns (uint256) {
  return allowed[_owner][_spender];
}
`