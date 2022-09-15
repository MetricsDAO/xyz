import questionStateControllerJson from "contracts/QuestionStateController.json";
import { BigNumber, ethers } from "ethers";
import type { ContractContext } from "~/types/generated/QuestionStateController";
import { questionStateEnum } from "~/utils/helpers";

const GET_QUESTIONS_OFFSET = 1000;

export default class QuestionStateControllerService {
  private questionStateController: ContractContext;

  constructor(provider: ethers.providers.Provider) {
    this.questionStateController = new ethers.Contract(
      questionStateControllerJson.address,
      questionStateControllerJson.abi,
      provider
    ) as unknown as ContractContext;
  }

  async getQuestionsByState(currentQuestionId: number) {
    const questions = await this.questionStateController.getQuestionsByState(
      BigNumber.from(questionStateEnum.VOTING),
      BigNumber.from(currentQuestionId),
      BigNumber.from(GET_QUESTIONS_OFFSET)
    );
    return questions;
  }
}
