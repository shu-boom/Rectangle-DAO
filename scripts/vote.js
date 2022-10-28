
const { ethers, network, getNamedAccounts } = require("hardhat");
const { VOTING_PERIOD, LOCAL_NETWORK_TAG, PROPOSAL_FILE_NAME } = require("../global-variables.js");
const { _vote } = require("./helpers/_vote.js");
const { mineBlocks } = require("./utils/time.js");
const fs = require('fs');
const VOTES = {
    AGAINST: 0,
    FOR: 1,
    ABSTAIN: 2
}

async function vote(proposalId, vote, account) {
    console.log("Voting on Proposal Id : ", proposalId)
    let response = await _vote(proposalId, vote, account); 
    const {voter, support, weight} = response;
    console.log("Casted a vote by ", voter, " with support ", support, " having weight ", weight);

    if (!network.live && network.config.tags.includes(LOCAL_NETWORK_TAG)) {
        console.log("Detected local network....")
        console.log("Bringing voting state to end....")
        await mineBlocks(VOTING_PERIOD+1);
    }
}

async function retrieveId() {
    if(fs.existsSync(PROPOSAL_FILE_NAME)){
        const chainId = await getChainId();
        console.log(chainId)
        proposals = JSON.parse(fs.readFileSync(PROPOSAL_FILE_NAME, "utf8"));
        const proposalArray =  proposals[chainId]
        console.log(proposalArray)
        return proposalArray.length == 0 ? undefined :
        proposalArray[proposalArray.length-1];
    }
}


(async function () {
    const {deployer} = await getNamedAccounts();
    let proposalId = await retrieveId();
    let support = VOTES.FOR;
    console.log("Proposal ID ", proposalId);
    console.log("Vote ", support);
    console.log("deployer ", deployer);
    vote(proposalId, support, deployer).catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
  })().then(() => {
});


module.exports = {
    vote
}