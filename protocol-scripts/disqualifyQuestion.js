const { ethers, BigNumber } = require("ethers");
require("dotenv").config();

console.log(process.env.NETWORK);
const questionAPIJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/QuestionAPI.json`);

let provider;
let signer;

// }
if (process.env.NETWORK === "polygon") {
  provider = new ethers.providers.JsonRpcProvider(process.env.NETWORK_URL);
  const privateKey = process.env.PRIVATE_KEY;
  signer = new ethers.Wallet(privateKey, provider);
} else {
  //localhost
  provider = new ethers.providers.JsonRpcProvider();
  signer = provider.getSigner();
}

console.log(process.env.NETWORK, process.env.NETWORK_URL);

async function init() {
  const gasPrice = await provider.getGasPrice();
  const feeData = await provider.getFeeData();
  // {
  //   gasPrice: { BigNumber: "23610503242" },
  //   maxFeePerGas: { BigNumber: "46721006484" },
  //   maxPriorityFeePerGas: { BigNumber: "1500000000" }
  // }

  console.log("gasPrice", gasPrice, feeData);

  // numbers taken from https://polygonscan.com/gastracker?data=30

  let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
  let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei

  const questionAPI = new ethers.Contract(questionAPIJson.address, questionAPIJson.abi, signer);

  try {
    const tx = await questionAPI.disqualifyQuestion(BigNumber.from(27), {
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
    const receipt = await tx.wait();
    console.log("receipt", receipt);
  } catch (error) {
    console.log("setCostController", error);
  }
}

init();
