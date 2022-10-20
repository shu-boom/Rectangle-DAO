const { ethers } = require("hardhat");
const { 
    VOTING_DELAY, 
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
    PROPOSAL_THRESHOLD } = require("../global-variables");

module.exports = async (hre) => {
    const {getNamedAccounts, deployments} = hre;
    const {deploy, get} = deployments;
    const {deployer} = await getNamedAccounts();

    console.log("----------------------------")

    const governanceToken = await ethers.getContract("RectangleToken", deployer);
    const timeLock = await ethers.getContract("TimeLock", deployer);
    
    await deploy('RectangleGoverner', {
      from: deployer,
      args: [ 
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY, 
        VOTING_PERIOD,
        QUORUM_PERCENTAGE,
        PROPOSAL_THRESHOLD
      ],
      log: true,
    });

};

module.exports.tags = ['governor'];