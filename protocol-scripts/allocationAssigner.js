const { ethers } = require("ethers");
require('dotenv').config();
const metricJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/MetricToken.json`);
const topChefJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/TopChef.json`);
const allocationGroups = require('./allocationGroups.json');

// TODO change this to whatever provider is available based on env variables
const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner();


async function init() {

    const metricToken = new ethers.Contract(metricJson.address, metricJson.abi, signer);
    const topChef = new ethers.Contract(topChefJson.address, topChefJson.abi, signer);

    await metricToken.transfer(topChefJson.address, await metricToken.totalSupply())

    const alocGrps = allocationGroups;
    for (let i = 0; i < allocationGroups.length; i++) {
        try {
            await topChef.addAllocationGroup(alocGrps[i].address, alocGrps[i].shares);
        } catch (error) {
            console.log("ERROR", error);
        }
    }
    await topChef.toggleRewards(true);
}

init();