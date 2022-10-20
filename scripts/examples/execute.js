// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, network } = require("hardhat");
const { _execute } = require("../helpers/_execute.js");
const { _propose } = require("../helpers/_propose.js");
const { mineBlocks } = require("../utils/time.js");
const {
  VOTING_PERIOD, VOTING_DELAY
} = require("../../global-variables");

async function generateProposalDetailsForLength(newLength) {
  const rectangle = await ethers.getContract("Rectangle")
  let targets = [rectangle.address]
  let values = [0]
  let calldataLength = [rectangle.interface.encodeFunctionData('setLength', [newLength])];
  let descriptionLength = `This is a proposal sets the length to ${newLength}`;
  let hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(descriptionLength));
  return {
    targets: targets,
    values: values,
    calldata: calldataLength,
    description: descriptionLength,
    hash: hash
  }
}

async function createNewProposal(targets, values, calldata, description) {
  const rectangleGoverner = await ethers.getContract("RectangleGoverner")
  let proposalId = await _propose(targets, values, calldata, description);
  console.log("The proposal id is ", proposalId);
  console.log("The proposal state is ", await rectangleGoverner.state(proposalId));
  console.log("Moving blocks to bring proposal to an active state");
  mineBlocks(VOTING_DELAY+1);
  return proposalId
}

async function voteOnProposal(proposalId){
  const rectangleGoverner = await ethers.getContract("RectangleGoverner")
  const { deployer } = await getNamedAccounts();
  const signer = await ethers.getSigner(deployer);
  await rectangleGoverner.connect(signer).castVote(proposalId, 1);
  console.log("Quorum reached for proposal : ", await rectangleGoverner.quorumReached(proposalId));
  console.log("Moving VOTING_PERIOD amount of blocks forward.... ");
  await mineBlocks(VOTING_PERIOD);
}

async function execute() {
  if (network.live && !network.config.tags.includes(LOCAL_NETWORK_TAG)) {
    console.log("This script is only available for local network")
    console.log("Please use this command run this example script : npm run execute");
    return
  }

  const rectangleGoverner = await ethers.getContract("RectangleGoverner")
  const rectangle = await ethers.getContract("Rectangle")
  console.log("Proposal to change the current area :", await rectangle.getArea());
  const {
    targets,
    values,
    calldata,
    description,
    hash
  } = await generateProposalDetailsForLength(6);
  console.log("Creating a new proposal....")
  let proposalId = await createNewProposal(targets, values, calldata, description);
  await voteOnProposal(proposalId);
  console.log("Queuing proposal....");
  await rectangleGoverner.queue(targets, values, calldata, hash);
  await mineBlocks(VOTING_DELAY+1);
  proposalId = await _execute(targets, values, calldata, hash);
  console.log("The proposal state is ", await rectangleGoverner.state(proposalId));
  console.log("The proposal effect is present because area is not changed", await rectangle.getArea());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
execute().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
