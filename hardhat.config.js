require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require('hardhat-deploy');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    solc: {
        version: "pragma"
    },
    compilers: [
      {
        version: "0.8.9",
      }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 4
      }
    }
  },
  networks: {
    hardhat: {
      live: false,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
      tags: ["local"]
    },
    localhost: {
      live: false,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
      tags: ["local"]
    }
  },
  namedAccounts: {
    deployer: 0,
    alice: 1
  }
};
