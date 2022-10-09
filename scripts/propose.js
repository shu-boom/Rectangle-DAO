// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, network } = require("hardhat");
const { _propose } = require("./helpers/_propose.js");
const { moveTime, moveBlocks } = require("./utils/time.js");

async function propose() {
  const rectangle = await ethers.getContract(
    "Rectangle"
  )
  const targets = [rectangle.address]
  const values = [0]
  const newLength = 3;
  const calldatas = [rectangle.interface.encodeFunctionData('setLength', [newLength])];
  const description = "This is a test";   
  await _propose(targets, values, calldatas, description);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
propose().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
