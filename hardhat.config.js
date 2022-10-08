require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    solc: {
        version: "pragma"
    },
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.4.26",
      }
    ]
  },
};
