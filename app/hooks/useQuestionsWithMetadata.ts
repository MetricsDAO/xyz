import { BigNumber } from "ethers";
import type { Result } from "ethers/lib/utils";
import _ from "lodash";
import { useState } from "react";
import { useContractRead, useNetwork } from "wagmi";
import create from "zustand";
import { iPFSdomain, questionStateEnum } from "~/utils/helpers";
import type { IpfsData } from "~/utils/types";
import { useContracts } from "./useContracts";

const DEBOUNCE_IPFS_FETCH = 1000;
const QUESTION_LIMIT = 1000;

export type GetQuestionsByState = {
  questionId: BigNumber;
  questionState: number;
  totalVotes: BigNumber;
  uri: string;
  voters: string[];
};

export type MetadataByQuestionId = Record<number, Metadata>;

export type Metadata = {
  isError: boolean;
  data?: IpfsData;
};

type QuestionStore = {
  questions: GetQuestionsByState[];
  ipfsDataByQuestionId: MetadataByQuestionId;
  isLoadingQuestions: boolean;
  fetchIpfsData: () => Promise<void>;
  initializeQuestions: (q: GetQuestionsByState[]) => void;
};

const useQuestionStore = create<QuestionStore>((set, get) => ({
  questions: [],
  isLoadingQuestions: true,
  ipfsDataByQuestionId: {},
  initializeQuestions: async (q: GetQuestionsByState[]) => {
    set({ questions: q, isLoadingQuestions: false });
  },
  fetchIpfsData: async () => {
    // Debounce set of IPFS data to avoid unnecessary re-renders. IPFS data will mostly retrieve quickly, except for some laggards. We shouldn't wait for those before doing a set.
    const tempIpfsDataByQuestionId: Record<number, Metadata> = {};
    const debouncedSet = _.debounce(() => {
      set({ ipfsDataByQuestionId: tempIpfsDataByQuestionId });
    }, DEBOUNCE_IPFS_FETCH);

    get().questions.forEach(async (q) => {
      try {
        const ipfsData = await fetchIpfsData(q.uri);
        tempIpfsDataByQuestionId[q.questionId.toNumber()] = { isError: false, data: ipfsData };
      } catch (e) {
        console.error(e);
        tempIpfsDataByQuestionId[q.questionId.toNumber()] = { isError: true };
      }
      debouncedSet();
    });
  },
}));

// Wrapper for useQuestionStore to be able to get chain data using wagmi hooks
export function useQuestionsWithMetaData() {
  const store = useQuestionStore();

  const onSuccess = (data: Result) => {
    store.initializeQuestions(data as GetQuestionsByState[]);
    store.fetchIpfsData();
  };

  useContractQuestions({ onSuccess });

  return store;
}

// Get "the most recent question" id and then use that to get a list of the questions relative to that id.
function useContractQuestions({ onSuccess }: { onSuccess?: (data: Result) => void }) {
  const { chain } = useNetwork();
  const { bountyQuestionJson, questionStateController } = useContracts({ chainId: chain?.id });

  const [questionId, setQuestionId] = useState<BigNumber>();
  useContractRead({
    addressOrName: questionStateController.address,
    contractInterface: questionStateController.abi,
    functionName: "getQuestionsByState",
    enabled: questionId === undefined ? false : true,
    args: [BigNumber.from(questionStateEnum.VOTING), questionId, BigNumber.from(QUESTION_LIMIT)],
    onSuccess,
  });

  useContractRead({
    addressOrName: bountyQuestionJson.address,
    contractInterface: bountyQuestionJson.abi,
    functionName: "getMostRecentQuestion",
    onSuccess: (data: Result) => {
      if (BigNumber.isBigNumber(data)) {
        setQuestionId(data);
      }
    },
  });
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
