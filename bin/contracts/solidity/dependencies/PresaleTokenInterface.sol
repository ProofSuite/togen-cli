pragma solidity ^0.4.15;

/**
 * @title PresaleTokenInterface
 * Standard Mintable ERC20 Token
 */

contract PresaleTokenInterface {

  uint256 public totalSupply;

  function balanceOf(address _owner) public constant returns (uint256);
  function transfer(address _to, uint _value) public returns (bool);
  function transferFrom(address _from, address _to, uint _value) public returns (bool);
  function approve(address _spender, uint _value) public returns (bool);
  function allowance(address _owner, address _spender) public constant returns (uint256);
  function mint(address _to, uint256 _amount) public returns (bool);
  function finishMinting() public returns (bool);

}