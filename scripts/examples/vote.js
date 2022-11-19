const { ethers, network } = require("hardhat");
const { _propose } = require("../helpers/_propose.js");
const { _vote } = require("../helpers/_vote.js");
const { mineBlocks } = require("../utils/time.js");

/**
 *   Important 0bservations for voting: 
 *      Checkpoints load the votes held by an account at a certain block number
 *      Casting vote, Transferring tokens, minting and burning tokens are some actions that trigger checkpoints creation
 *      Checkpoint creation is important. It helps us understand how much voting power an account holds at a certain block number 
 *      A proposal is bounded by a start and an end date. Therefore, it bercomes easy to calculate if someone is allowed to vote on a proposal or not. 
 *      The Openzeppelin governer allows anyone to vote on the proposal if they have voting power before the proposal was created (Prevents double voting)
 *      Users vote with all of their voting power (Plutocracies warning!)
 *      It is important to note that every user must delegate to atleast themselves for the first time to initiate voting capabilities. 
 *      When one user's transfer tokens to other users, the voting power of their delegates update and gets recorded as a checkoint along with the block number of the transaction.
 *      getPastVotes show the correct voting power at a given block number
 *      The checkpoint lookup is a binary search function that gives the latest checkpoint before the given block number
 */

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
  console.log("Bringing proposal to an ACTIVE state");
  await mineBlocks(2);
  const state = await rectangleGoverner.state(proposalId);
  console.log("The proposal state is ", state);
  return proposalId
}

async function logVotingDetails(details, proposalId, account) {
  const rectangleGoverner = await ethers.getContract("RectangleGoverner")
  console.log("Voting Power : ", await rectangleGoverner.getVotes(account, await ethers.provider.getBlockNumber()-1));
  console.log("Support : ", details.support);
  console.log("Weight : ", details.weight);
  console.log("Voter : ", details.voter);
}

async function logBalanceAndVotingPower(account){
  const rectangleToken = await ethers.getContract("RectangleToken")
  const rectangleGoverner = await ethers.getContract("RectangleGoverner")
  console.log("Balance : ", await rectangleToken.balanceOf(account))
  console.log("Voting power", await rectangleGoverner.getVotes(account, await ethers.provider.getBlockNumber()-1))
}

async function transferAmountAndLogDetails(from, to, amount) {
  let fromsigner = await ethers.getSigner(from);
  let tosigner = await ethers.getSigner(to);
  const rectangleToken = await ethers.getContract("RectangleToken")
  const rectangleGoverner = await ethers.getContract("RectangleGoverner")
  console.log("Balance of deployer before transfer ", await rectangleToken.balanceOf(from))
  console.log("Voting Power of deployer before transfer ", await rectangleGoverner.getVotes(from,await ethers.provider.getBlockNumber()-1))
  console.log("Balance of alice before transfer ", await rectangleToken.balanceOf(to))
  console.log("Voting Power of alice before transfer ", await rectangleGoverner.getVotes(to, await ethers.provider.getBlockNumber()-1))
  console.log()
  const transferTx = await rectangleToken.connect(fromsigner).transfer(to, BigInt(amount));
  await transferTx.wait(1);
  const delegateTx = await rectangleToken.connect(tosigner).delegate(to)
  await delegateTx.wait(1);
  console.log("Balance of deployer after transfer ", await rectangleToken.balanceOf(from))
  console.log("Voting Power of deployer after transfer ", await rectangleGoverner.getVotes(from, await ethers.provider.getBlockNumber()-1))
  console.log("Balance of alice after transfer ", await rectangleToken.balanceOf(to))
  console.log("Voting Power of alice after transfer ", await rectangleGoverner.getVotes(to, await ethers.provider.getBlockNumber()-1))
}

async function vote() {
  if (network.live && !network.config.tags.includes(LOCAL_NETWORK_TAG)) {
    console.log("This script is only available for local network")
    console.log("Please use this command run this example script : npm run vote");
    return
  }

  const rectangleGoverner = await ethers.getContract("RectangleGoverner")
  const rectangleToken = await ethers.getContract("RectangleToken")
  const { deployer, alice } = await getNamedAccounts();

  console.log("Creating a new proposal....")
  let proposal1Details = await generateProposalDetailsForLength(4);
  let proposal1Id = await createNewProposal(proposal1Details.targets, proposal1Details.values, proposal1Details.calldata, proposal1Details.description);

  console.log("Account details of deployer.......")
  await logBalanceAndVotingPower(deployer);
  
  let resp = await _vote(proposal1Id, 1, deployer);
  await logVotingDetails(resp, proposal1Id, deployer)

  console.log("Transferring All balance to alice.......")
  await transferAmountAndLogDetails(deployer, alice, await rectangleToken.balanceOf(deployer));

  resp = await _vote(proposal1Id, 1, alice);
  console.log("Voting details for alice...")

  await logVotingDetails(resp, proposal1Id, alice)

  console.log("This shows that x amount of tokens can be used to vote on a proposal only once.")
  console.log("Let's create another proposal and check if these tokens can be used to vote on a separate proposal")

  console.log("Creating a new proposal...")

  let proposal2Details = await generateProposalDetailsForLength(5);
  let proposal2Id = await createNewProposal(proposal2Details.targets, proposal2Details.values, proposal2Details.calldata, proposal2Details.description);

  console.log("This shows that alice could not use those tokens on the new proposal as well.")
  console.log("Let's try to mine some blocks so the first proposal finish voting.")

  console.log("State of proposal ",  await rectangleGoverner.state(proposal2Id))

  console.log("Account details of alice.......")
  await logBalanceAndVotingPower(alice);

  resp = await _vote(proposal2Id, 1, alice);
  console.log("Voting details for alice...")
  logVotingDetails(resp, proposal2Id, alice)

  console.log("State of proposal 1",  await rectangleGoverner.state(proposal1Id))
  console.log("State of proposal 2",  await rectangleGoverner.state(proposal2Id))

  console.log("Transferring All balance back to deployer.......")
  await transferAmountAndLogDetails(alice, deployer, await rectangleToken.balanceOf(alice));

  console.log("As we can see the quorum for both proposal is reached but they are not queued and executed yet")
  console.log("Please see execute example by running: npm run execute")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
vote().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
