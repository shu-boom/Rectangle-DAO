// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

/**
 * Governer API contains a propose method: 
 */
async function _vote(proposalId, vote, account) {
    const rectangleGoverner = await ethers.getContract("RectangleGoverner"); 
    try {
        const signer = await ethers.getSigner(account);
        console.log("Voting.....")
        const voteTx = await rectangleGoverner.connect(signer).castVote(proposalId, vote);
        const voteTxReceipt = await voteTx.wait();
        const voteCastEvent = voteTxReceipt.events?.find((x) => {return x.event == "VoteCast"})
        const [voter,, support, weight, reason] = voteCastEvent.args;
        return {
            "voter": voter,
            "support": support,
            "weight": weight
        }
          
    } catch (error) {
        console.log(error);
    } 
}


module.exports = {
    _vote
}
