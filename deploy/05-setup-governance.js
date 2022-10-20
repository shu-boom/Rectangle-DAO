const { ethers } = require("hardhat");

module.exports = async (hre) => {
    const {getNamedAccounts, deployments} = hre;
    const {deployer} = await getNamedAccounts();

    console.log("----------------------------")
    console.log("Setting up TimeLock")

    const timeLock = await ethers.getContract("TimeLock", deployer);
    const rectangleGoverner = await ethers.getContract("RectangleGoverner", deployer);

    // TimelockController uses an AccessControl setup that we need to understand in order to set up roles.

    // The Proposer role is in charge of queueing operations: this is the role the Governor instance should be granted, 
    // and it should likely be the only proposer in the system.
    const proposerRole = await timeLock.PROPOSER_ROLE();
    await timeLock.grantRole(proposerRole, rectangleGoverner.address);
   
    // The Executor role is in charge of executing already available operations: we can assign this role to the special zero address to allow anyone to execute 
    // (if operations can be particularly time sensitive, the Governor should be made Executor instead).
    const executorRole = await timeLock.EXECUTOR_ROLE();
    await timeLock.grantRole(executorRole, ethers.constants.AddressZero);

    // Lastly, there is the Admin role, which can grant and revoke the two previous roles: 
    // this is a very sensitive role that will be granted automatically to both deployer and timelock itself
    // , but should be renounced by the deployer after setup.
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();
    await timeLock.revokeRole(adminRole, deployer);
};

module.exports.tags = ['setup'];