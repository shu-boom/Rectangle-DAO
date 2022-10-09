const { MIN_DELAY } = require("../global-variables");

module.exports = async (hre) => {
    const {getNamedAccounts, deployments} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    console.log("----------------------------")
    
    const proposers = [];
    const executors = [];

    await deploy('TimeLock', {
      from: deployer,
      args: [MIN_DELAY, proposers, executors],
      log: true,
    });


};

module.exports.tags = ['TimeLock'];