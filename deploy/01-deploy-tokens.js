module.exports = async (hre) => {
    const {getNamedAccounts, deployments} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    console.log("----------------------------")
    
    await deploy('RectangleToken', {
      from: deployer,
      args: [],
      log: true,
    });


};

module.exports.tags = ['token'];