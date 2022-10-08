// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const length = 2;
  const width = 2;

  const Rectangle = await hre.ethers.getContractFactory("Rectangle");
  const rectangle = await Rectangle.deploy(length, width);

  await rectangle.deployed();

  console.log(
    `Rectangle with length ${length} and width ${width} deployed to ${rectangle.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
