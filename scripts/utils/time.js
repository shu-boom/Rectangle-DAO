const { ethers, network } = require("hardhat");
const { LOCAL_NETWORK_TAG, AVERAGE_MINING_TIME } = require("../../global-variables");
const hre = require("hardhat");

const moveBlocks = async function (numOfBlocks) {
    if(numOfBlocks>100){
        await hre.network.provider.send('hardhat_mine', [ethers.utils.hexlify(numOfBlocks)]);
    }
    else{
        for (let index = 0; index < numOfBlocks; index++) {
            await ethers.provider.send('evm_mine');
        }
    }
    
}

/** 
 * @param timeInMinutes Moves forward time for local chains
 */
const moveTime = async function (timeInSeconds) {
    await ethers.provider.send('evm_increaseTime', [timeInSeconds * 60 * 60 ]); // forwards by 5 mins
    await ethers.provider.send('evm_mine');
}


async function mineBlocks(numOfBlocks){
    if (!network.live && network.config.tags.includes(LOCAL_NETWORK_TAG)) {
        console.log(`Mining ${numOfBlocks} blocks.....`);
        await moveTime((numOfBlocks * AVERAGE_MINING_TIME) + 1);
        await moveBlocks(numOfBlocks);
    }
}
  

module.exports = {
    mineBlocks
}