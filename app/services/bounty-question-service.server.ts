import { BigNumber } from "ethers";
import type { ContractContext } from "~/types/generated/BountyQuestion";

export default class BountyQuestionService {
  constructor(private bountyQuestionContract: ContractContext) {}

  async getCurrentQuestion() {
    const tx = await this.bountyQuestionContract.getMostRecentQuestion();
    if (BigNumber.isBigNumber(tx)) {
      return tx.toNumber();
    }
  }
}
