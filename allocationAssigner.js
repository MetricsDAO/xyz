const { ethers, utils } = require("ethers");
require('dotenv').config();
const topChefJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/TopChef.json`);
const allocationGroups = require('./allocationGroups.json');

const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner();


async function init() {

    const topChef = new ethers.Contract(topChefJson.address, topChefJson.abi, signer);
    const alocGrps = allocationGroups;
    for (let i=0; i<allocationGroups.length; i++) {
        try {
        await topChef.addAllocationGroup(alocGrps[i].address, utils.parseUnits(alocGrps[i].shares, "ether"), alocGrps[i].autoDistribute);
        } catch(error) {
            console.log("ERROR", error);
        }
    }
}

init();