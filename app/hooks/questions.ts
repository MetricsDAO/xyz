import { BigNumber } from "ethers";
import { useEffect, useReducer, useState } from "react";
import { useContractRead, useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { iPFSdomain, questionStateEnum } from "~/utils/helpers";
import type { IpfsData, QuestionData } from "~/utils/types";
import { useContracts } from "./contracts";

export type getQuestionsByStateResult = {
  questionId: BigNumber;
  questionState: number;
  totalVotes: BigNumber;
  uri: string;
  voters: string[];
}[];

function useGetMostRecentQuestion() {
  const { chain } = useNetwork();
  const { bountyQuestionJson } = useContracts({ chainId: chain?.id });

  return useContractRead({
    addressOrName: bountyQuestionJson.address,
    contractInterface: bountyQuestionJson.abi,
    functionName: "getMostRecentQuestion",
  });
}

function useGetQuestionsByState() {
  const { chain } = useNetwork();
  const { questionStateController } = useContracts({ chainId: chain?.id });

  const [questionId, setQuestionId] = useState<BigNumber>();
  const contractRead = useContractRead({
    addressOrName: questionStateController.address,
    contractInterface: questionStateController.abi,
    functionName: "getQuestionsByState",
    enabled: questionId === undefined ? false : true,
    args: [BigNumber.from(questionStateEnum.VOTING), questionId, BigNumber.from(1000)],
  });
  return {
    setQuestionId,
    contractRead,
  };
}

export function useQuestions() {
  const { data: getMostRecentQuestionResult } = useGetMostRecentQuestion();
  const { contractRead, setQuestionId } = useGetQuestionsByState();

  useEffect(() => {
    if (getMostRecentQuestionResult) {
      if (BigNumber.isBigNumber(getMostRecentQuestionResult)) {
        setQuestionId(getMostRecentQuestionResult);
      }
    }
  }, [getMostRecentQuestionResult, setQuestionId]);

  return {
    contractRead,
  };
}

const initialState = { questionData: undefined };

function reducer(
  state: { questionData: QuestionData[] | undefined },
  action:
    | { type: "init"; payload: QuestionData[] }
    | { type: "update"; payload: { questionId: number; isError: boolean; ipfsData?: IpfsData } }
    | { type: "reset" }
) {
  switch (action.type) {
    case "reset":
      return { questionData: undefined };
    case "init":
      return { questionData: action.payload };
    case "update":
      const newQuestionData = state.questionData?.map((question) => {
        if (question.questionId === action.payload.questionId) {
          return {
            ...question,
            metadata: {
              isLoading: false,
              isError: action.payload.isError,
              data: action.payload.ipfsData,
            },
          };
        }
        return question;
      });
      return { questionData: newQuestionData };
    default:
      throw new Error(`Action type does not exist`);
  }
}

export function useQuestionsWithIpfsData() {
  const { contractRead } = useQuestions();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetch = async () => {
      if (contractRead.status === "success" && contractRead.data) {
        const loadingQuestions = contractRead.data.map((question) => {
          return {
            uri: question.uri,
            questionId: question.questionId.toNumber(),
            totalVotes: question.totalVotes.toNumber(),
            metadata: {
              isLoading: true,
              isError: false,
            },
          };
        });
        dispatch({ type: "init", payload: loadingQuestions });
        getIpfsData(loadingQuestions);
      } else if (contractRead.status === "error") {
        dispatch({ type: "reset" });
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractRead.status]);

  const getIpfsData = async (questionData: QuestionData[]) => {
    questionData.forEach(async (q) => {
      try {
        const ipfsData = await fetchIpfsData(q.uri);
        dispatch({ type: "update", payload: { isError: false, questionId: q.questionId, ipfsData } });
      } catch (e) {
        console.error(e);
        dispatch({ type: "update", payload: { isError: true, questionId: q.questionId } });
      }
    });
  };

  return {
    questionsWithIpfsData: state.questionData,
  };
}

async function fetchIpfsData(uriOrUrl: string) {
  // TODO: We had some bad data at some point by the looks of it. Can't delete from blockchain?...
  const url = uriOrUrl.includes("https") ? uriOrUrl : iPFSdomain + uriOrUrl;
  const response = await fetch(url);
  if (response.ok) {
    const ipfsData: IpfsData = await response.json();
    return ipfsData;
  }
  throw new Error(`Something went wrong fetching ipfs data from ${url}`);
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
