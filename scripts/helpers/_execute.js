// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

/**
 * Governer API contains an execute method: 
 */
const _execute = async function (targets, values, calldatas, description) {
    const {getNamedAccounts, deployments} = hre;
    const {deployer} = await getNamedAccounts();   
    const rectangleGoverner = await ethers.getContract("RectangleGoverner", deployer);
    const executeTx = await rectangleGoverner.execute(targets, values, calldatas, description);
    await executeTx.wait();
}


module.exports = {
  _execute
}
