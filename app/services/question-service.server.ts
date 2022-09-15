import type { QuestionstatsResponse } from "~/types/generated/QuestionStateController";
import type BountyQuestionService from "./contracts/bounty-question-service.server";
import type QuestionStateControllerService from "./contracts/question-state-controller-service.server";

export default class QuestionService {
  constructor(
    private bountyQuestionService: BountyQuestionService,
    private questionStateControllerService: QuestionStateControllerService
  ) {}

  //TODO: use this
  async getQuestions() {
    const currentQuestion = await this.bountyQuestionService.getCurrentQuestion();
    if (!currentQuestion) {
      return [];
    }
    const questions = await this.questionStateControllerService.getQuestionsByState(currentQuestion);
    // Implement logic
    return questions.map((q: QuestionstatsResponse) => ({
      id: q.questionId.toNumber(),
      state: q.questionState,
      totalVotes: q.totalVotes.toNumber(),
      uri: q.uri,
    }));
  }
}
