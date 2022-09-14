import { BigNumber } from "ethers";
import type { Contracts } from "./contracts.server";

export default class BountyQuestionContract {
  constructor(private contracts: Contracts) {}

  async getCurrentQuestion() {
    const tx = await this.contracts.bountyQuestionContract.getMostRecentQuestion();
    if (BigNumber.isBigNumber(tx)) {
      return tx.toNumber();
    }
  }
}
