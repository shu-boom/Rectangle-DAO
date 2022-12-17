const { ethers, network } = require("hardhat");
const { VOTING_DELAY, LOCAL_NETWORK_TAG, PROPOSAL_FILE_NAME } = require("../global-variables.js");
const { _propose } = require("./helpers/_propose.js");
const { mineBlocks } = require("./utils/time.js");

async function logBalanceAndVotingPower(account){
    const rectangleToken = await ethers.getContract("RectangleToken")
    const rectangleGoverner = await ethers.getContract("RectangleGoverner")
    console.log("Balance : ", await rectangleToken.balanceOf(account))
    console.log("Voting power", await rectangleGoverner.getVotes(account, await ethers.provider.getBlockNumber()-1))
  }
  


async function crowdsale() {
    const rectangleToken = await ethers.getContract("RectangleToken")
    const rectangleCrowdsale = await ethers.getContract("RectangleCrowdsale")
    const { deployer, alice } = await getNamedAccounts();
    const rectangleGoverner = await ethers.getContract("RectangleGoverner")

    console.log("address of deployer ", deployer)
    console.log("address of alice ", alice)
    console.log("address of crowdsale ", rectangleCrowdsale.address)

    console.log("##### Deployer voting details .......")
    await logBalanceAndVotingPower(deployer);
    console.log("##### Alice voting details .......")
    await logBalanceAndVotingPower(alice);
    console.log("##### Crowdsale Allowance voting  .......")
    console.log("Allowance : ", await rectangleToken.allowance(deployer, rectangleCrowdsale.address))
    console.log("Crowdsale Voting power", await rectangleGoverner.getVotes(rectangleCrowdsale.address, await ethers.provider.getBlockNumber()-1))
   
    let customersigner = await ethers.getSigner(alice);
    const transferFromTx = await rectangleCrowdsale.connect(customersigner).buyTokens(100);
    await transferFromTx.wait(1);
   
    await mineBlocks(2);
   
    // console.log("##### Deployer voting details .......")
    // await logBalanceAndVotingPower(deployer);
    // console.log("##### Alice voting details .......")
    // await logBalanceAndVotingPower(alice);

    console.log("##### Delegation .......")
    const delegateTx = await rectangleToken.connect(customersigner).delegate(alice)
    await delegateTx.wait(1);
    
    await mineBlocks(2);

    console.log("##### Deployer voting details .......")
    await logBalanceAndVotingPower(deployer);
    console.log("##### Alice voting details .......")
    await logBalanceAndVotingPower(alice);
    console.log("##### Delegation .......")
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
crowdsale().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
  

module.exports = {
    crowdsale
}