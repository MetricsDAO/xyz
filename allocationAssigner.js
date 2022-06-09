const { ethers } = require("ethers");
require('dotenv').config();
const topChefJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/TopChef.json`);
const allocationGroups = require('./allocationGroups.json');

const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner();


async function init() {

    const topChef = new ethers.Contract(topChefJson.address, topChefJson.abi, signer);
    console.log('topChef', !!topChef);
    console.log('allocationGroups', allocationGroups);

    //const firstAllocator = await topChef.addAllocationGroup("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199", 10000, false);
    //console.log('testing', firstAllocator);
    // const groups = await topChef.getAllocationGroups();
    // groups.filter((group, index) => {
    //     if (index === otherIndex) {
    //         return group.shares;
    //     }
    // });

    const alocGrps = allocationGroups;
    for (let i=0; i<allocationGroups.length; i++) {
        try {
        await topChef.addAllocationGroup(alocGrps[i].address, alocGrps[i].shares, alocGrps[i].autoDistribute);
        } catch(error) {
            console.log("ERROR", error);
        }
    }

    try {
    const groups = await topChef.getAllocationGroups();
    console.log('firstGroup share Amount', groups[0]);
    } catch (error) {
        console.log("ERROR", error);
    }


}

init();