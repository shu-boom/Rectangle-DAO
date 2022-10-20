module.exports = async (hre) => {
    const {getNamedAccounts, deployments} = hre;
    const {deployer} = await getNamedAccounts();
    const token = await ethers.getContract("RectangleToken", deployer);
    console.log("----------------------------")
    console.log("Delegating power to deployer")
    await token.delegate(deployer)
};

module.exports.tags = ['delegate'];