// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Rectangle {
    uint public length;
    uint public width;
    address public owner;

    event LengthChanged(uint length);
    event WidthChanged(uint width);

    constructor(uint _length, uint _width) {
        length = _length;
        width = _width;
        owner = msg.sender;
    }

    function getArea() public view returns(uint area){
        area = length * width;
    }
  
    function setLength(uint _newLength) public {
        require(msg.sender == owner, "Only Owner");
        length = _newLength;
        emit LengthChanged(length);
    }

     function setWidth(uint _newWidth) public {
        require(msg.sender == owner, "Only Owner");
        width = _newWidth;
        emit WidthChanged(width);
    }
}