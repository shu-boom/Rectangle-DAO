
const { ethers, network} = require("hardhat");
const { VOTING_DELAY, LOCAL_NETWORK_TAG } = require("../global-variables.js");
const { mineBlocks } = require("./utils/time.js");
const { _execute } = require("./helpers/_execute.js");
  
async function queue(targets, values, calldata, hash) {
    console.log("Queuing proposal....");
    const rectangleGoverner = await ethers.getContract("RectangleGoverner")
    const queueTx =  await rectangleGoverner.queue(targets, values, calldata, hash);
    const queueTxReceipt = await queueTx.wait(network.config.waitConfirmations);
    const proposalQueuedEvent = queueTxReceipt.events?.find((x) => {return x.event == "ProposalQueued"})
    const [proposalId, eta] = proposalQueuedEvent.args;
    console.log("Queued proposal with ID : ", proposalId);
    console.log("ETA of queued proposal : ", eta);
    console.log("The state of the proposal should be 5 : ", await rectangleGoverner.state(proposalId))
    if (!network.live && network.config.tags.includes(LOCAL_NETWORK_TAG)) {
       console.log("Detected local network....")
       console.log("Mining blocks so proposal can be executed")
       await mineBlocks(VOTING_DELAY+50000);
    }
    console.log("The state of the proposal should be 7 : ", await rectangleGoverner.state(proposalId))
}

async function execute(targets, values, calldata, hash) {
    const rectangleGoverner = await ethers.getContract("RectangleGoverner")
    const proposalId = await _execute(targets, values, calldata, hash);
    console.log("Executed proposal with ID : ", proposalId);
    console.log("Proposal State should be 7 : ", await rectangleGoverner.state(proposalId));
}

(async function () {
    const rectangle = await ethers.getContract("Rectangle")
    let targets = [rectangle.address]
    let values = [0]
    let newLength = 8;
    let calldataLength = [rectangle.interface.encodeFunctionData('setLength', [newLength])];
    let descriptionLength = `This is a proposal sets the length to ${newLength}`;
    let hash = await ethers.utils.keccak256(ethers.utils.toUtf8Bytes(descriptionLength));
    await queue(targets, values, calldataLength, hash);
    execute(targets, values, calldataLength, hash).catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
  })().then(() => {
});

module.exports = {
    queue,
    execute
}



