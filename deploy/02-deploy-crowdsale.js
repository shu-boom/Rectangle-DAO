const { BigNumber } = require("ethers");

module.exports = async (hre) => {
    const {getNamedAccounts, deployments, network} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    console.log("----------------------------")
    const rectangleTokenContract =  await ethers.getContract("RectangleToken", deployer); // await ethers.getContractAt("RectangleToken", rectangleToken.address)
    const decimals = await rectangleTokenContract.decimals()

    await deploy('RectangleCrowdsale', {
      from: deployer,
      args: [decimals, rectangleTokenContract.address, deployer, 100000],
      log: true,
      waitConfirmations: network['config'].waitConfirmations || 1,
    });
};

module.exports.tags = ['crowdsale'];