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
      allowUnlimitedContractSize: true,
      timeout: 1800000
    },
    localhost: {
      allowUnlimitedContractSize: true,
      timeout: 1800000
    }
  },
  namedAccounts: {
    deployer: 0
  }
};
