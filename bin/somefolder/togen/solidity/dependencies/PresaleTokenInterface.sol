pragma solidity ^0.4.15;

/**
 * @title PresaleTokenInterface
 * Standard Mintable ERC20 Token
 */

contract PresaleTokenInterface {

  uint256 public totalSupply;

  function balanceOf(address _owner) constant returns (uint256);
  function transfer(address _to, uint _value) returns (bool);
  function transferFrom(address _from, address _to, uint _value) returns (bool);
  function approve(address _spender, uint _value) returns (bool);
  function allowance(address _owner, address _spender) constant returns (uint256);
  function mint(address _to, uint256 _amount) returns (bool);
  function finishMinting() returns (bool);

}