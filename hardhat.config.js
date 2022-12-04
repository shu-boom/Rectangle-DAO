require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require('hardhat-deploy');
require('hardhat-contract-sizer');
const ALCHEMY_GOERLI_URL = process.env.ALCHEMY_GOERLI_URL;
const PRIVATE_KEY_ACCOUNT_DEPLOYER = process.env.PRIVATE_KEY_ACCOUNT_DEPLOYER;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    goerli: {
      live: true,
      chainId: 5,
      tags: ["staging"],
      url: ALCHEMY_GOERLI_URL,
      accounts: [PRIVATE_KEY_ACCOUNT_DEPLOYER],
      waitConfirmations: 5,
    },
    hardhat: {
      live: false,
      chainId: 31337,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
      tags: ["local"],
      waitConfirmations: 1
    },
    localhost: {
      live: false,      
      chainId: 31337,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
      tags: ["local"],
      waitConfirmations: 1
    }
  },
  namedAccounts: {
    deployer: 0,
    alice: 1
  }
}
