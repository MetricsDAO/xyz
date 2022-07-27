const { ethers } = require("ethers");
require('dotenv').config();
const xmetricJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Xmetric.json`);
const costControllerJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/ActionCostController.json`);
const bountyQuestionJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/BountyQuestion.json`);
const questionStateControllerJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/QuestionStateController.json`);
const vaultJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Vault.json`);
const claimControllerJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/ClaimController.json`);
const questionAPIJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/QuestionAPI.json`);

// HARDHAT addresses for testing
const hardhat16 = "0x2546bcd3c84621e976d8185a91a922ae77ecec30";
const hardhat17 = "0xbda5747bfd65f08deb54cb465eb87d40e51b197e";
const hardhat18 = "0xdd2fd4581271e230360230f9337d5c0430bf44c0";
const hardhat19 = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";

const hardhat5 = "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc";


const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner();

console.log(xmetricJson.address);

async function init() {

    const bountyQuestion = new ethers.Contract(bountyQuestionJson.address, bountyQuestionJson.abi, signer);
    const questionStateController = new ethers.Contract(questionStateControllerJson.address, questionStateControllerJson.abi, signer);
    const claimController = new ethers.Contract(claimControllerJson.address, claimControllerJson.abi, signer);
    const actionCostController = new ethers.Contract(costControllerJson.address, costControllerJson.abi, signer);
    
    const vault = new ethers.Contract(vaultJson.address, vaultJson.abi, signer);
    await vault.setCostController(costControllerJson.address)

    let tx = await bountyQuestion.setQuestionApi(questionAPIJson.address);
    let receipt = await tx.wait();
  
    tx = await questionStateController.setQuestionApi(questionAPIJson.address);
    receipt = await tx.wait();
  
    tx = await claimController.setQuestionApi(questionAPIJson.address);
    receipt = await tx.wait();
  
    tx = await actionCostController.setQuestionApi(questionAPIJson.address);
    receipt = await tx.wait();

    console.log(receipt)



    const xmetric = new ethers.Contract(xmetricJson.address, xmetricJson.abi, signer);
    await xmetric.setTransactor(costControllerJson.address, true);
    await xmetric.setTransactor(vaultJson.address, true);

    await xmetric.transfer(hardhat5, ethers.utils.parseEther("55"));

    await xmetric.transfer(hardhat16, ethers.utils.parseEther("160"));
    await xmetric.transfer(hardhat17, ethers.utils.parseEther("1700"));
    await xmetric.transfer(hardhat18, ethers.utils.parseEther("18000"));
    await xmetric.transfer(hardhat19, ethers.utils.parseEther("19"));
}

init();