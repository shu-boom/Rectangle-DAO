// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, network } = require("hardhat");
const { _execute } = require("./helpers/_execute.js");
const { moveTime, moveBlocks } = require("./utils/time.js");

async function execute() {
  await moveBlocks(50);
  const rectangle = await ethers.getContract(
    "Rectangle"
  )
  const targets = [rectangle.address]
  const values = [0]
  const newLength = 3;
  const calldatas = [rectangle.interface.encodeFunctionData('setLength', [newLength])];
  const description = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("This is a test"))    
  console.log("here", description)
  await _execute(targets, values, calldatas, description);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
execute().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
