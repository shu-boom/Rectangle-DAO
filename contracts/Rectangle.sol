// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rectangle is Ownable{
    uint public length;
    uint public width;

    event LengthChanged(uint length);
    event WidthChanged(uint width);

    constructor(uint _length, uint _width) {
        length = _length;
        width = _width;
    }

    function getArea() public view returns(uint area){
        area = length * width;
    }
  
    function setLength(uint _newLength) public onlyOwner{
        length = _newLength;
        emit LengthChanged(length);
    }

     function setWidth(uint _newWidth) public onlyOwner{
        width = _newWidth;
        emit WidthChanged(width);
    }
}