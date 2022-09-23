import { BigNumber } from "ethers";
import { useEffect, useReducer, useState } from "react";
import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { iPFSdomain, questionStateEnum } from "~/utils/helpers";
import type { QuestionData } from "~/utils/types";
import { useBountyQuestionContract, useContracts, useQuestionStateControllerContract } from "./useContracts";

export type getQuestionsByStateResult = {
  questionId: BigNumber;
  questionState: number;
  totalVotes: BigNumber;
  uri: string;
  voters: string[];
}[];

export function useQuestions() {
  const bountyQuestionContract = useBountyQuestionContract();
  const questionStateControllerContract = useQuestionStateControllerContract();

  const [questions, setQuestions] = useState<getQuestionsByStateResult>();

  // Get chain data
  useEffect(() => {
    const fetch = async () => {
      const recentQuestionId = await bountyQuestionContract.getMostRecentQuestion();
      if (BigNumber.isBigNumber(recentQuestionId)) {
        const questions: getQuestionsByStateResult = await questionStateControllerContract.getQuestionsByState(
          BigNumber.from(questionStateEnum.VOTING),
          recentQuestionId,
          BigNumber.from(1000)
        );
        setQuestions(questions);
      }
    };
    fetch();
  }, [bountyQuestionContract, questionStateControllerContract]);

  return {
    questions,
  };
}

const initialState = { questionData: undefined };

function reducer(
  state: { questionData: QuestionData[] | undefined },
  action:
    | { type: "init"; payload: QuestionData[] }
    | { type: "update"; payload: { questionId: number; ipfsData: IpfsData } }
) {
  switch (action.type) {
    case "init":
      return { questionData: action.payload };
    case "update":
      const ipfsData = action.payload.ipfsData;
      const newQuestionData = state.questionData?.map((question) => {
        if (question.questionId === action.payload.questionId) {
          return { ...question, name: ipfsData.name, program: ipfsData.program, description: ipfsData.description };
        }
        return question;
      });
      return { questionData: newQuestionData };
    default:
      throw new Error(`Action type does not exist`);
  }
}

export function useQuestionsWithIpfsData() {
  const { questions } = useQuestions();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetch = async () => {
      if (questions) {
        const loadingQuestions = questions.map((question) => {
          return {
            name: "Loading",
            program: "Loading",
            description: "Loading",
            uri: question.uri,
            questionId: question.questionId.toNumber(),
            totalVotes: question.totalVotes.toNumber(),
            date: "Loading",
            loading: true,
            unavailable: false,
          };
        });
        dispatch({ type: "init", payload: loadingQuestions });
        fetchIpfsData(loadingQuestions);
      }
    };
    fetch();
  }, [questions]);

  const fetchIpfsData = async (questionData: QuestionData[]) => {
    questionData.forEach(async (q) => {
      const ipfsData = await getIpfsdata(q.uri);
      dispatch({ type: "update", payload: { questionId: q.questionId, ipfsData } });
    });
  };

  return {
    questionsWithIpfsData: state.questionData,
  };
}

type IpfsData = { date: number; name: string; description: string; program: string };

async function getIpfsdata(uriOrUrl: string) {
  // TODO: We had some bad data at some point by the looks of it. Can't delete from blockchain?...
  const domain = uriOrUrl.includes("https") ? uriOrUrl : iPFSdomain + uriOrUrl;
  const response = await fetch(domain);
  // TODO: can we guarantee this type?
  const ipfsData: IpfsData = await response.json();
  return ipfsData;
}

export function useUpvoteQuestion({ questionId }: { questionId: number }) {
  const { chain } = useNetwork();
  const { questionAPIJson } = useContracts({ chainId: chain?.id });
  const { config } = usePrepareContractWrite({
    addressOrName: questionAPIJson.address,
    contractInterface: questionAPIJson.abi,
    functionName: "upvoteQuestion",
    args: [BigNumber.from(questionId)],
  });

  return useContractWrite(config);
}
