const { MIN_DELAY } = require("../global-variables");

module.exports = async (hre) => {
    const {getNamedAccounts, deployments, network} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    console.log("----------------------------")

    const proposers = [];
    const executors = [];

    await deploy('TimeLock', {
      from: deployer,
      args: [MIN_DELAY, proposers, executors],
      log: true,
      waitConfirmations: network['config'].waitConfirmations || 1,
    });
};

module.exports.tags = ['timelock'];