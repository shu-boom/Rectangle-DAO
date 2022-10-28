const { 
    VOTING_DELAY, 
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
    PROPOSAL_THRESHOLD } = require("../global-variables");

module.exports = async (hre) => {
    const {getNamedAccounts, deployments, network} = hre;
    const {deploy, log, get} = deployments;
    const {deployer} = await getNamedAccounts();

    console.log("----------------------------")
    const governanceToken = await get("RectangleToken");
    const timeLock = await get("TimeLock");
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
        waitConfirmations: network['config'].waitConfirmations|| 1,
    });

};

module.exports.tags = ['all','governor'];