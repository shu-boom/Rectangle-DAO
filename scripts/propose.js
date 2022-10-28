const { ethers, network } = require("hardhat");
const { VOTING_DELAY, LOCAL_NETWORK_TAG, PROPOSAL_FILE_NAME } = require("../global-variables.js");
const { _propose } = require("./helpers/_propose.js");
const { mineBlocks } = require("./utils/time.js");
const fs = require('fs')

async function propose(targets, values, calldatas, descriptions) {
    console.log("Creating a new proposal....")
    const rectangleGoverner = await ethers.getContract("RectangleGoverner")
    
    let proposalId = await _propose(targets, values, calldatas, descriptions);
    
    console.log("The proposal id is ", proposalId);
    console.log("The proposal state is ", await rectangleGoverner.state(proposalId));
    console.log("Proposal Snapshot (Voting Start Block) ", await rectangleGoverner.proposalSnapshot(proposalId));
    console.log("Proposal Deadline (Voting Deadline Block) ", await rectangleGoverner.proposalDeadline(proposalId));

    console.log();
    console.log("Storing proposal id....");
    storeProposal(proposalId);

    if (!network.live && network.config.tags.includes(LOCAL_NETWORK_TAG)) {
        console.log("Detected local network....")
        console.log("Bringing proposal to a voting state...")
        await mineBlocks(VOTING_DELAY+1);
    }

    return proposalId
}

async function storeProposal(proposalId) {
    const chainId = await getChainId();
    console.log(chainId);
    let proposals;
    if(fs.existsSync(PROPOSAL_FILE_NAME)){
        proposals = JSON.parse(fs.readFileSync(PROPOSAL_FILE_NAME, "utf8"));
        console.log(proposals);
        if(!proposals.hasOwnProperty(chainId)){
            proposals[chainId] = []
        }
        proposals[chainId].push(proposalId.toString())
    }else 
    {
        proposals = {}
        proposals[chainId] = [proposalId.toString()]
    }
    fs.writeFileSync(PROPOSAL_FILE_NAME, JSON.stringify(proposals), "utf8");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

(async function () {
    const rectangle = await ethers.getContract("Rectangle")
    let targets = [rectangle.address]
    let values = [0]
    let newLength = 8;
    let calldataLength = [rectangle.interface.encodeFunctionData('setLength', [newLength])];
    let descriptionLength = `This is a proposal sets the length to ${newLength}`;
    propose(targets, values, calldataLength, descriptionLength).catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
  })().then(() => {
});

module.exports = {
    propose
}