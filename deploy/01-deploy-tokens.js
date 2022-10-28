module.exports = async (hre) => {
    const {getNamedAccounts, deployments, network} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    console.log("----------------------------")

    await deploy('RectangleToken', {
      from: deployer,
      args: [],
      log: true,
      waitConfirmations: network['config'].waitConfirmations || 1,
    });
};

module.exports.tags = ['token'];