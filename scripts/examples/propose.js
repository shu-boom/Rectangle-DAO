// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, network, getNamedAccounts } = require("hardhat");
const { _propose } = require("../helpers/_propose.js");
const { mineBlocks } = require("../utils/time.js");
const {
  VOTING_PERIOD, VOTING_DELAY
} = require("../../global-variables");
/* * 
 *  Important observations about proposals: 
 *      It is not possible to create the same proposal twice. The smart contract fires a proposal already exists error
 *      It is not possible to cancel the proposal as well. A seperate function must be added in order to cancel a proposal.
 *      All proposal share the same time constraints.     
 */


async function createNewProposal(newLength) {
  const rectangle = await ethers.getContract("Rectangle")
  const rectangleGoverner = await ethers.getContract("RectangleGoverner")
  let targets = [rectangle.address]
  let values = [0]
  let calldataLength = [rectangle.interface.encodeFunctionData('setLength', [newLength])];
  let descriptionLength = `This is a proposal sets the length to ${newLength}`;
  let proposalId = await _propose(targets, values, calldataLength, descriptionLength);
  console.log("The proposal id is ", proposalId);
  console.log("The proposal state is ", await rectangleGoverner.state(proposalId));
  return proposalId
}

/**
 * @param {bigint} proposalId 
 * 
 *   hashProposal(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) → uint256 proposalId public
     state(uint256 proposalId) 
     proposalSnapshot(uint256 proposalId) -> uint256 BlockNumber which would be used to calculate quorum 10
     proposalDeadline(uint256 proposalId) -> Block number at which votes close. 50410
     * The snapshot and the deadline are start and end bounds for a proposal
     quorum(uint256 blockNumber) → uint256 Minimum number of cast voted required for a proposal to be successful.
     _voteSucceeded(proposalId)
 */
async function printProposalDetails(proposalId) {
  const rectangleGoverner = await ethers.getContract("RectangleGoverner")
  let blockNum = await ethers.provider.getBlockNumber();
  console.log("Created proposal with id: ", proposalId);
  console.log("Proposal State: ", await rectangleGoverner.state(proposalId));
  console.log("Proposal Snapshot (Voting Start Block) ", await rectangleGoverner.proposalSnapshot(proposalId));
  console.log("Proposal Deadline (Voting Deadline Block) ", await rectangleGoverner.proposalDeadline(proposalId));
  console.log("The quorum required to pass the proposal should be 50% of total voting supply: ", await rectangleGoverner.quorum(--blockNum));
  console.log("Please see voting example by running: npm run vote")

}

async function propose() {
  if (network.live && !network.config.tags.includes(LOCAL_NETWORK_TAG)) {
    console.log("This script is only available for local network")
    console.log("Please use this command run this example script : npm run propose");
    return
  }
  let blockNum = await ethers.provider.getBlockNumber();
  console.log("The block number before creating proposal", blockNum);
  console.log("Creating a new proposal....")
  let proposalId = await createNewProposal(3);
  mineBlocks(VOTING_DELAY+1);
  await printProposalDetails(proposalId);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
propose().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
