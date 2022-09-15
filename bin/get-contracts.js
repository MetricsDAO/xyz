const fs = require("fs");
const dotenv = require("dotenv");
const { exec } = require("child_process");
dotenv.config();

const CORE_EVM_CONTRACTS = [
  "QuestionAPI",
  "QuestionStateController",
  "BountyQuestion",
  "ActionCostController",
  "Vault",
  "Xmetric",
];

// write contracts to contracts folder
const network = process.env.NETWORK ?? "localhost";
for (const c of CORE_EVM_CONTRACTS) {
  let contractJson = require(`core-evm-contracts/deployments/${network}/${c}.json`);
  fs.writeFile(`contracts/${c}.json`, JSON.stringify(contractJson, null, 2), "utf8", () => {});
}

// generate types with abi-types-generator
for (const c of CORE_EVM_CONTRACTS) {
  exec(
    `abi-types-generator './contracts/${c}.json' --provider=ethers_v5 --output='./app/types/generated' --name=${c}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}
