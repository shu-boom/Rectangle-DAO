const { ethers } = require("hardhat");

module.exports = async (hre) => {
    const {getNamedAccounts, deployments, network} = hre;
    const {deployer} = await getNamedAccounts();
    console.log("----------------------------")
    const contract =  await ethers.getContract("RectangleToken", deployer); // await ethers.getContractAt("RectangleToken", rectangleToken.address)
    const waitConfirmations =  network.config.waitConfirmations || 1;
    const delegateTx = await contract.delegate(deployer)
    await delegateTx.wait(waitConfirmations);
};

module.exports.tags = ['delegate'];
