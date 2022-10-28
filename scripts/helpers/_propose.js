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
 *     parameters: 
 *        address[] targets : the contract that should be the target for this proposal. In our example, we can change the length or width of our rectangle. This should be Rectangle address
 *        uint256[] values, : the value that we want to pass with each target 
 *        bytes[] calldatas, : calldata is the function encoding result of function and its parameters. use contract.interface.encodeFunctionData('function_name',[parameters])
 *        string description : description for proposals.  
 *     returns uint256 proposalId for storage of the created proposal. This will be used for frontend. 
 *     const targets = [rectangle.address]
 *     const values = [0]
 *     const newLength = 3;
 *     const calldatas = [rectangle.interface.encodeFunctionData('setLength', [newLength])];
 *     const description = "This is a test 2";
 */
async function _propose(targets, values, calldatas, description) {
    const rectangleGoverner = await ethers.getContract("RectangleGoverner");  
    const proposeTx = await rectangleGoverner.propose(targets, values, calldatas, description);
    const proposeTxReceipt = await proposeTx.wait();
    const proposalCreatedEvent = proposeTxReceipt.events?.find((x) => {return x.event == "ProposalCreated"})
    const [proposalId] = proposalCreatedEvent.args;
    return proposalId;
}


module.exports = {
  _propose
}
