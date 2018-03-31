//Using inheritance, constructors, modifiers refering back to ChainList.sol

pragma solidity ^0.4.18;

contract Ownable{
//state variable
address owner;

//modifiers
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
  // underscore semicolon: represents the code of the function that the modifier applies to
}
  // constructor
  function Ownable() public {
    owner = msg.sender;
  }
}
