const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

module.exports = async (hre) => {
    const {getNamedAccounts, deployments, network} = hre;
    const {deployer} = await getNamedAccounts();
    console.log("----------------------------")
    const rectangleTokenContract =  await ethers.getContract("RectangleToken", deployer); // await ethers.getContractAt("RectangleToken", rectangleToken.address)
    const rectangleCrowdsale =  await ethers.getContract("RectangleCrowdsale", deployer); // await ethers.getContractAt("RectangleToken", rectangleToken.address)
    const waitConfirmations =  network.config.waitConfirmations || 1;
    const totalSupply = await rectangleTokenContract.totalSupply();
    const approvedSupply = (totalSupply.mul(3)).div(4);
    const approveTx = await rectangleTokenContract.approve(rectangleCrowdsale.address, approvedSupply)
    await approveTx.wait(waitConfirmations);
};

module.exports.tags = ['approveSupply'];