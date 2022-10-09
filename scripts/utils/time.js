const { ethers, network } = require("hardhat");
const { LOCAL_NETWORK_TAG } = require("../../global-variables");
/**
* 
* @param {*} numOfBlocks Move forward blocks for local chains
   Sample Usage
   const blockNumBefore = await ethers.provider.getBlockNumber();
   const blockBefore = await ethers.provider.getBlock(blockNumBefore);
   const timestampBefore = blockBefore.timestamp;
   console.log(blockNumBefore)
   await moveBlocks(value)
   const blockNumAfter = await ethers.provider.getBlockNumber();
   const blockAfter = await ethers.provider.getBlock(blockNumAfter);
   const timestampAfter = blockAfter.timestamp;
   console.log(blockNumAfter)
*/
const moveBlocks = async function (numOfBlocks) {
    if(!network.live && network.config.tags.includes(LOCAL_NETWORK_TAG)){
        await hre.network.provider.send("hardhat_mine", [ethers.utils.hexlify(numOfBlocks)]);
    }
}
/** 
 * @param timeInMinutes Moves forward time for local chains
 */
const moveTime = async function (timeInMinutes) {
    if(!network.live && network.config.tags.includes(LOCAL_NETWORK_TAG)){
        console.log("here");
        await ethers.provider.send('evm_increaseTime', [timeInMinutes*60]); // forwards by 5 mins
        await ethers.provider.send('evm_mine');
    }
}

module.exports = {
  moveTime,
  moveBlocks
}