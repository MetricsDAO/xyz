import { useEffect, useState } from "react";
import { useContractRead, useContractWrite, usePrepareContractWrite, useContract, useProvider } from "wagmi";
import { BigNumber } from "ethers";

import AlertBanner from "~/components/AlertBanner";
import {
  TransactionStatus,
  iPFSdomain,
  usePrevious,
  questionStateEnum,
  OFFSET,
  sortMethods,
  protocols,
} from "~/utils/helpers";

import type { QuestionData, ChainDataQuestion, ContractEntity } from "~/utils/types";
import QuestionControls from "./QuestionControls";
import QuestionList from "./questionList";
import ShowQuestions from "./ShowQuestions";

// let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
// let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei

export default function AllQuestionsByState({
  latestQuestion,
  questionStateController,
  questionAPI,
  networkMatchesWallet,
  chainId,
}: {
  latestQuestion: number;
  questionStateController: ContractEntity;
  questionAPI: ContractEntity;
  networkMatchesWallet: boolean;
  chainId: number;
}) {
  const [questionDataVotingState, setQuestionDataVotingState] = useState<ChainDataQuestion[]>([]);
  const [questionArray, setQuestionArray] = useState<QuestionData[]>([]);
  const [uxShow, setUXToShow] = useState<boolean>(false);
  const [alertContainerStatus, setAlertContainerStatus] = useState<boolean>(false);
  const [writeTransactionStatus, setWriteTransactionStatus] = useState<string>(TransactionStatus.Pending);

  const [selected, setSelected] = useState(sortMethods[0].name);

  const [selectedProgram, setSelectedProgram] = useState(
    protocols.reduce((acc, protocol) => {
      acc[protocol.name] = false;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [questionIdToVote, setQuestionIdToVote] = useState<number>();

  const [getTotalVotes, setGetTotalVotes] = useState<number>(0);

  const prevTokenId = usePrevious(latestQuestion);
  const provider = useProvider();

  const { data: questionData } = useContractRead({
    addressOrName: questionStateController.address,
    contractInterface: questionStateController.abi,
    functionName: "getQuestionsByState",
    args: [BigNumber.from(questionStateEnum.VOTING), BigNumber.from(latestQuestion), BigNumber.from(OFFSET)],
    chainId: chainId,
    cacheOnBlock: true,
    onError: (err) => {
      console.error(err);
    },
  });

  const prevQuestionData = usePrevious(questionData);

  const { config, isSuccess } = usePrepareContractWrite({
    addressOrName: questionAPI.address,
    contractInterface: questionAPI.abi,
    functionName: "upvoteQuestion",
    args: questionIdToVote ? [BigNumber.from(questionIdToVote)] : [],
    enabled: Boolean(questionIdToVote),
    onError(err) {
      console.error(err);
    },
    onSettled(data, error) {
      console.log("Settled", { data, error });
      if (error) {
        setWriteTransactionStatus(TransactionStatus.Failed);
      }
    },
    onSuccess(data) {
      console.log("Success", data);
    },
  });

  const { writeAsync } = useContractWrite(config);

  const questionAPIContract = useContract({
    addressOrName: questionStateController.address,
    contractInterface: questionStateController.abi,
    signerOrProvider: provider,
  });

  useEffect(() => {
    if (Array.isArray(questionData)) {
      if (prevTokenId !== latestQuestion || questionData.length !== prevQuestionData?.length) {
        setQuestionArray(
          questionData.map((question) => {
            return {
              name: "Loading",
              program: "Loading",
              description: "Loading",
              url: question.uri,
              questionId: question.questionId.toNumber(),
              totalVotes: question.totalVotes.toNumber(),
              date: "Loading",
              loading: true,
              unavailable: false,
            };
          })
        );
        setUXToShow(true);
        setQuestionDataVotingState(questionData);
      }
    }
  }, [questionData, prevTokenId, latestQuestion, prevQuestionData]);

  useEffect(() => {
    const ac = new AbortController();
    async function getIpfsdata(obj: ChainDataQuestion) {
      const domain = obj.uri.includes("https") ? obj.uri : iPFSdomain + obj.uri;
      try {
        const response = await fetch(domain, {
          signal: ac.signal,
        });
        const ipfsData = await response.json();
        ipfsData.url = obj.uri;
        ipfsData.questionId = obj.questionId.toNumber();
        ipfsData.totalVotes = obj.totalVotes.toNumber();
        ipfsData.date = ipfsData.date || "Unavailable currently";
        ipfsData.program = typeof ipfsData.program === "string" ? ipfsData.program : ipfsData.program.name;
        ipfsData.loading = false;

        setQuestionArray((prevArray) => {
          return prevArray.map((question) => {
            if (question.questionId === ipfsData.questionId) {
              return { ...question, ...ipfsData };
            } else {
              return question;
            }
          });
        });
      } catch (error: any) {
        const ipfsdataFailure = {
          name: "Unavailable currently",
          program: "Unavailable currently",
          description: "Unavailable currently",
          url: obj.uri,
          questionId: obj.questionId.toNumber(),
          totalVotes: obj.totalVotes.toNumber(),
          date: "Unavailable currently",
          loading: false,
          unavailable: true,
        };
        if (error.name === "AbortError") return;
        setQuestionArray((prevArray) => {
          return prevArray.map((question) => {
            if (question.questionId === ipfsdataFailure.questionId) {
              return { ...question, ...ipfsdataFailure };
            } else {
              return question;
            }
          });
        });
      }
    }
    questionDataVotingState.forEach((question) => {
      getIpfsdata(question);
    });
    return () => ac.abort();
  }, [questionDataVotingState]);

  useEffect(() => {
    if (questionArray.length && questionArray.length === questionDataVotingState.length) {
      setUXToShow(true);
      //reset here
      setGetTotalVotes(0);
    }
  }, [questionArray, questionDataVotingState]);

  useEffect(() => {
    function contractCall() {
      return questionAPIContract.getTotalVotes(BigNumber.from(getTotalVotes));
    }
    if (getTotalVotes) {
      contractCall().then((res: BigNumber) => {
        setQuestionArray((prevArray) => {
          return prevArray.map((question) => {
            if (question.questionId === getTotalVotes) {
              return { ...question, totalVotes: res.toNumber() };
            } else {
              return question;
            }
          });
        });
      });
    }
  }, [getTotalVotes, questionAPIContract]);

  useEffect(() => {
    async function initUpVoteQuestion() {
      if (!isSuccess || !questionIdToVote) return;

      setWriteTransactionStatus(TransactionStatus.Pending);
      setAlertContainerStatus(true);
      setButtonDisabled(true);
      try {
        const approvetxnResponse = await writeAsync?.();
        const approveconfirmation = await approvetxnResponse?.wait();
        if (approveconfirmation?.blockNumber) {
          setWriteTransactionStatus(TransactionStatus.Approved);
          setButtonDisabled(false);
          setGetTotalVotes(questionIdToVote);
          setTimeout(async () => {
            setAlertContainerStatus(false);
          }, 9000);
        }
      } catch (error) {
        console.error("ERRR", error);
        setWriteTransactionStatus(TransactionStatus.Failed);
        setButtonDisabled(false);
      }
    }

    initUpVoteQuestion();
  }, [isSuccess, writeAsync, questionIdToVote]);

  return (
    <>
      {alertContainerStatus && (
        <AlertBanner transactionStatus={writeTransactionStatus} setAlertContainerStatus={setAlertContainerStatus} />
      )}
      {uxShow === true ? (
        <div className="tw-flex tw-px-4 tw-flex-row justify-center tw-space-x-4">
          <div className="tw-block tw-border tw-p-2">
            <QuestionControls
              setSelected={setSelected}
              selected={selected}
              setSelectedProgram={setSelectedProgram}
              selectedProgram={selectedProgram}
            />
          </div>
          <div className="tw-bg-white tw-basis-1/2 tw-p-6 tw-rounded-lg tw-space-y-2">
            <ShowQuestions
              selected={selected}
              selectedProgram={selectedProgram}
              questions={questionArray}
              setQuestionIdToVote={setQuestionIdToVote}
              networkMatchesWallet={networkMatchesWallet}
              buttonDisabled={buttonDisabled}
            />
          </div>
          {/* <QuestionList /> */}

          <div className="tw-border tw-basis-1/4 tw-p-2">
            <button disabled={true} className="tw-p-2">
              {" "}
              + Create question{" "}
            </button>
            <h4 className="tw-font-bold tw-text-xl tw-p-2">Bounty question writing tips</h4>
            <div className="tw-p-5">
              <p className="tw-font-bold">Be specific</p>
              <p className="tw-text-sm tw-mb-4 tw-text-[#637381]">tips</p>
            </div>
            <div className="tw-p-5">
              <p className="tw-font-bold">Examples of good writing</p>
              <p className="tw-text-sm tw-mb-4 tw-text-[#637381]">examples</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="tw-flex tw-items-center tw-justify-center tw-p-4 tw-rounded-lg tw-mb-7">
          <h1 className="tw-mr-5 tw-text-xl">Loading</h1>
          <svg
            role="status"
            className="tw-w-8 tw-h-8 tw-mr-2 tw-text-gray-200 tw-animate-spin tw-dark:text-gray-600 tw-fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            ></path>
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            ></path>
          </svg>
        </div>
      )}
    </>
  );
}
