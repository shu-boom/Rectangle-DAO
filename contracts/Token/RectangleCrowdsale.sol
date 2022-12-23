// contracts/RectangleCrowdsale.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title RectangleCrowdsale
 * @dev This is an example of a fully fledged crowdsale.
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RectangleToken.sol";

error MaxWithdrawlAllowed(uint maximumWithdrawableAmount);
error WithdrawlLimitReached();

contract RectangleCrowdsale is Ownable{
    RectangleToken public token;
    uint public decimals;
    address public tokenOwner;
    uint public withdrawLimitPerAccount;

    event TokenPurchase(
        address indexed beneficiary,
        uint256 amount
    );
    
    mapping(address => uint) public withdraws;

    constructor(
        uint256 _decimals,
        address _token,
        address _tokenOwner,
        uint _withdrawLimitPerAccount
    ) {
        token = RectangleToken(_token);
        decimals = _decimals;
        tokenOwner = _tokenOwner;
        withdrawLimitPerAccount = _withdrawLimitPerAccount * 10 ** _decimals;
    } 

    function getAllowance() public view returns(uint) {
        return token.allowance(tokenOwner, address(this));
    }

    function getWithdrawableBalanceForAnAccount() public view returns(uint){
        return withdrawLimitPerAccount - withdraws[msg.sender];
    }

    function buyTokens(uint _amount) public payable{
        require(_amount > 0, "Amount must be specified");
        require(msg.value == 0, "Token is free");
        uint transferAmount =  _amount * 10 ** decimals;
        uint allowance = token.allowance(tokenOwner, address(this));
        require(transferAmount <= allowance, "not enough token left");
        if(transferAmount>withdrawLimitPerAccount){
            revert MaxWithdrawlAllowed(withdrawLimitPerAccount);
        }
        if(withdraws[msg.sender] + transferAmount > withdrawLimitPerAccount){
            revert WithdrawlLimitReached();
        }
        allowance = allowance - transferAmount;
        withdraws[msg.sender] += transferAmount;
        token.transferFrom(tokenOwner, msg.sender, transferAmount);
        emit TokenPurchase(msg.sender, _amount);
    }

}

