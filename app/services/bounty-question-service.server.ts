import bountyQuestionJson from "contracts/BountyQuestion.json";
import { BigNumber, ethers } from "ethers";
import type { ContractContext } from "~/types/generated/BountyQuestion";

export default class BountyQuestionService {
  bountyQuestionContract: ContractContext;

  constructor(provider: ethers.providers.Provider) {
    this.bountyQuestionContract = new ethers.Contract(
      bountyQuestionJson.address,
      bountyQuestionJson.abi,
      provider
    ) as unknown as ContractContext;
  }

  async getCurrentQuestion() {
    const tx = await this.bountyQuestionContract.getMostRecentQuestion();
    if (BigNumber.isBigNumber(tx)) {
      return tx.toNumber();
    }
  }
}
