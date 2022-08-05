const { ethers } = require("ethers");
require('dotenv').config();
const xmetricJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Xmetric.json`);
const costControllerJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/ActionCostController.json`);
const bountyQuestionJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/BountyQuestion.json`);
const questionStateControllerJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/QuestionStateController.json`);
const vaultJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Vault.json`);
const claimControllerJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/ClaimController.json`);
const questionAPIJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/QuestionAPI.json`);




let signer;
let account1; //hardhat16  //third
let account2; //hardhat17  //fourth
let account3; //hardhat18  //fifth
let account4; //hardhat19  //sixth

// if (process.env.NETWORK === "localhost") {
//     account1 = "0x2546bcd3c84621e976d8185a91a922ae77ecec30";
//     account2 = "0xbda5747bfd65f08deb54cb465eb87d40e51b197e";
//     account3 = "0xdd2fd4581271e230360230f9337d5c0430bf44c0";
//     account4 = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";
//     signer = provider.getSigner();
// } else if (process.env.NETWORK === "ropsten") {
//     account1 = "0x6f080B4820221b932EbF0C5A40286835D591A215";
//     account2 = "0x8d550cBA64eB7A8dFD8d88772621e6B47A4b3E55";
//     account3 = "0x077479Ac7Ce949b0D950F9c28b8F017793036d61";
//     account4 = "0xCa827406ea36f488be7b7FE1D6D05622e162b26F";
//     const privateKey = process.env.PRIVATE_KEY;
//     signer = new ethers.Wallet(privateKey, provider);
// } else {

// }
const provider = new ethers.providers.JsonRpcProvider(process.env.NETWORK_URL);
const privateKey = process.env.PRIVATE_KEY;
signer = new ethers.Wallet(privateKey, provider);




console.log(xmetricJson.address, process.env.NETWORK, process.env.NETWORK_URL);

async function init() {

    const gasPrice = await provider.getGasPrice();

    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    console.log("gasPrice", gasPrice);
    const bountyQuestion = new ethers.Contract(bountyQuestionJson.address, bountyQuestionJson.abi, signer);
    const questionStateController = new ethers.Contract(questionStateControllerJson.address, questionStateControllerJson.abi, signer);
    const claimController = new ethers.Contract(claimControllerJson.address, claimControllerJson.abi, signer);
    
    const actionCostController = new ethers.Contract(costControllerJson.address, costControllerJson.abi, signer);
    
    const vault = new ethers.Contract(vaultJson.address, vaultJson.abi, signer);

    // try {
    // const tx = await vault.setCostController(costControllerJson.address, {
    //     gasPrice: 30000000000
    // });
    // const receipt = await tx.wait();
    // console.log("receipt", receipt);
    // } catch(error) {
    //     console.log("setCostController", error)
    // }

    // let tx = await bountyQuestion.setQuestionApi(questionAPIJson.address, {
    //     gasPrice: 30000000000
    // });
    // let receipt = await tx.wait();
  
    // tx = await questionStateController.setQuestionApi(questionAPIJson.address, {
    //     gasPrice: 30000000000
    // });
    // receipt = await tx.wait();
  
    // tx = await claimController.setQuestionApi(questionAPIJson.address, {
    //     gasPrice: 30000000000
    // });
    // receipt = await tx.wait();
  
    // tx = await actionCostController.setQuestionApi(questionAPIJson.address, {
    //     gasPrice: 30000000000
    // });
    // receipt = await tx.wait();

    // console.log(receipt)



    const xmetric = new ethers.Contract(xmetricJson.address, xmetricJson.abi, signer);

    try {
        await xmetric.setTransactor(costControllerJson.address, true, {
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
    } catch(error) {
        console.log("setTransactor", "costControllerJson", error)
    }

    try {
        await xmetric.setTransactor(vaultJson.address, true, {
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
    } catch(error) {
        console.log("setTransactor", "vaultJson", error)
    }

    // try {
    // await actionCostController.setCreateCost(0, {
    //     maxFeePerGas,
    //     maxPriorityFeePerGas,
    // });
    // await actionCostController.setVoteCost(0, {
    //     maxFeePerGas,
    //     maxPriorityFeePerGas,
    // });
    // } catch(error) {
    //     console.log("ERRRRRR!!!!! setcost", error);
    // }

    // await xmetric.transfer(hardhat5, ethers.utils.parseEther("55"));

    // await xmetric.transfer(account1, ethers.utils.parseEther("166"));
    // await xmetric.transfer(account2, ethers.utils.parseEther("1770"));
    // await xmetric.transfer(account3, ethers.utils.parseEther("18800"));
    // await xmetric.transfer(account4, ethers.utils.parseEther("199"));
}

init();