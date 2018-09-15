pragma solidity ^0.4.24;

contract NameTBD {
  address owner;
  mapping(address => bool) isDoctor;
  mapping(address => bool) isPharmacy;
  uint storedData;

  modifier isOwner() { require(msg.sender == owner); _; }

  constructor() public {
    owner = msg.sender;
  }

  function set(uint x) public isOwner() {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
