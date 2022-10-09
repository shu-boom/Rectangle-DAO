const { ethers } = require("hardhat");

module.exports = async (hre) => {
    const {getNamedAccounts, deployments} = hre;
    const {deploy, get} = deployments;
    const {deployer} = await getNamedAccounts();
    const length = 2;
    const width = 2;
    console.log("----------------------------")

    await deploy('Rectangle', {
      from: deployer,
      args: [ 
        length,
        width,
      ],
      log: true,
    });
 
    const rectangle = await ethers.getContract("Rectangle", deployer);
    const timeLock = await ethers.getContract("TimeLock", deployer);

    await rectangle.transferOwnership(timeLock.address)
};

module.exports.tags = ['rectangle'];