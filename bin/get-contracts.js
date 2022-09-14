const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const CONTRACTS = [
  "QuestionAPI",
  "QuestionStateController",
  "BountyQuestion",
  "ActionCostController",
  "Vault",
  "Xmetric",
];

const network = process.env.NETWORK ?? "localhost";
for (const c of CONTRACTS) {
  let contractJson = require(`core-evm-contracts/deployments/${network}/${c}.json`);
  fs.writeFile(`contracts/${c}.json`, JSON.stringify(contractJson, null, 2), "utf8", () => {});
}
