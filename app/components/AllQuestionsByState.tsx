import { useEffect, useState} from "react";
import { useContractRead, useContractWrite } from 'wagmi';
import { BigNumber, utils } from "ethers";
import { CSVLink } from "react-csv";
import { Download16 } from '@carbon/icons-react';

import AlertBanner from "~/components/AlertBanner";
import MyRadioGroup from "~/components/RadioGroup";
import DropDown from "~/components/DropDownAllQuestions";
import ShowQuestions  from "~/components/ShowQuestions";
import { TransactionStatus, usePrevious, questionStateEnum, OFFSET, sortMethods, protocols } from '~/utils/helpers';


export default function AllQuestionsByState ({latestQuestion, questionStateController, questionAPI}: {latestQuestion:number, questionStateController: Record<string, string>, questionAPI: Record<string, string>}) {
    const [questionDataVotingState, setQuestionDataVotingState] = useState<any>([]);
    const [querstionArray, setQuestionArray] = useState<any>([]);
    const [uxShow, setUXToShow] = useState<boolean>(false);
    const [alertContainerStatus, setAlertContainerStatus] = useState<boolean>(false);
    const [writeTransactionStatus, setWriteTransactionStatus] = useState<string>(TransactionStatus.Pending);
  
    const [selected, setSelected] = useState(sortMethods[0]);
  
    const [selectedProgram, setSelectedProgram] = useState(protocols[0]);
  
    const prevTokenId = usePrevious(latestQuestion);

    console.log("latestQuestion,",latestQuestion, "prevTokenId", prevTokenId)
  
    const {data: questionData} = useContractRead({
      addressOrName: questionStateController.address,
      contractInterface: questionStateController.abi,
  }, 'getQuestionsByState', {
      args: [BigNumber.from(questionStateEnum.VOTING), BigNumber.from(latestQuestion), BigNumber.from(OFFSET)],
      enabled: true,
      onError: (err) => {
        console.error(err);
      },
    });

    const prevQuestionData = usePrevious(questionData);
  
    const upVoteQuestion = useContractWrite({
      addressOrName: questionAPI.address,
      contractInterface: questionAPI.abi,
  }, 'upvoteQuestion', {
      onError: (err) => {
          console.error(err);
        },
        onSettled(data, error) {
          console.log('Settled', { data, error })
          if (error) {
              setWriteTransactionStatus(TransactionStatus.Failed);
          }
        },
        onSuccess(data) {
          console.log('Success', data)
        },
    });
  
    useEffect(() => {
      if (Array.isArray(questionData)) {
          if (prevTokenId !== latestQuestion || questionData.length !== prevQuestionData?.length) {
            console.log("questionData", questionData);
            setQuestionArray(questionData.map((question:any) => {
                return {
                    name: "Loading",
                    program: "Loading",
                    description: "Loading",
                    url: question.url,
                    questionId: question.questionId.toNumber(),
                    totalVotes: utils.formatEther(question.totalVotes.toString()),
                    date: "Unavailable currently",
                    loading: true,
                }
            }))
            setUXToShow(true);
            setQuestionDataVotingState(questionData);
         }
      }
    }, [questionData,  questionDataVotingState, prevTokenId, latestQuestion, prevQuestionData, querstionArray.length])
  
    useEffect(() => {
      const ac = new AbortController();
      async function getIpfsdata (obj:any) {
          try {
          const response = await fetch(obj.url, {
            signal: ac.signal
          });
          const ipfsData = await response.json();
          ipfsData.url = obj.url;
          ipfsData.questionId = obj.questionId.toNumber();
          ipfsData.totalVotes = utils.formatEther(obj.totalVotes.toString());
          ipfsData.date = ipfsData.date || "Unavailable currently";
          ipfsData.program = typeof ipfsData.program === "string" ? ipfsData.program : ipfsData.program.name;
          ipfsData.loading = false;
  
          setQuestionArray((prevArray: any) => {
            return prevArray.map((question:any) => {
              if (question.questionId === ipfsData.questionId) {
                return {...question, ...ipfsData}
              } else {
                return question;
              }
            })
          })
  
          } catch (error:any) {
              const ipfsdataFailure = {
                  name: "Unavailable currently",
                  program: "Unavailable currently",
                  description: "Unavailable currently",
                  url: obj.url,
                  questionId: obj.questionId.toNumber(),
                  totalVotes: utils.formatEther(obj.totalVotes.toString()),
                  date: "Unavailable currently"
              };
              if (error.name === 'AbortError') return
              setQuestionArray((prevArray: any) => {
                return prevArray.map((question:any) => {
                  if (question.questionId === ipfsdataFailure.questionId) {
                    return {...question, ...ipfsdataFailure}
                  } else {
                    return question;
                  }
                })
              })
          }
      }
      questionDataVotingState.forEach((question:any) => {
        getIpfsdata(question);
      })
      return () => ac.abort();
    }, [questionDataVotingState])
  
    useEffect(() => {
      if (querstionArray.length && querstionArray.length === questionDataVotingState.length) {
          setUXToShow(true);
      }
    }, [querstionArray, questionDataVotingState]);
  
    async function initUpVoteQuestion(questionId: number) {
      setWriteTransactionStatus(TransactionStatus.Pending);
      setAlertContainerStatus(true);
      try {
        const approvetxnResponse = await upVoteQuestion.writeAsync({
            args: [BigNumber.from(questionId), utils.parseEther("1")],
            overrides: {
                gasLimit: 30000000,
                gasPrice: 10000000,
                },
        });
        console.log("approvetxnResponse", approvetxnResponse )
        const approveconfirmation = await approvetxnResponse.wait();
        console.log("approveconfirmation", approveconfirmation )
        if (approveconfirmation.blockNumber) {
            setWriteTransactionStatus(TransactionStatus.Approved);
            setTimeout(() => {
                setAlertContainerStatus(false);
            }, 9000); 
    
        }
      } catch(error) {
        console.error("ERRR", error);
        setWriteTransactionStatus(TransactionStatus.Failed);
      } 
    }
  
    return (
      <>
      {alertContainerStatus && <AlertBanner transactionStatus={writeTransactionStatus} setAlertContainerStatus={setAlertContainerStatus} />}
        {uxShow === true ? (
            <div className="tw-flex tw-justify-center">
            <div className="tw-invisible tw-w-1/6"></div>
            <div className="bg-white  tw-p-6 tw-rounded-lg tw-w-2/3">
                    <ShowQuestions 
                    selected={selected}
                    selectedProgram={selectedProgram}  
                    questions={querstionArray} 
                    initUpVoteQuestion={initUpVoteQuestion} 
                    />
            </div>
            <div className="tw-w-1/6 tw-px-4">
            <MyRadioGroup setSelected={setSelected} selected={selected} />
            <DropDown setSelectedProgram={setSelectedProgram} selectedProgram={selectedProgram} />
            <CSVLink data={querstionArray} className="blue-button tw-bg-[#21C5F2] tw-mt-8 tw-flex tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white" filename={"question-data.csv"} target="_blank"> 
              <span className="tw-mr-3">Download CSV </span>
              <Download16 />
            </CSVLink>
            </div>
            </div>
        ) : (
            <div className="tw-flex tw-items-center tw-justify-center tw-p-4 tw-rounded-lg tw-mb-7">
                <h1 className="tw-mr-5 tw-text-xl">Loading</h1>
                <svg role="status" className="tw-w-8 tw-h-8 tw-mr-2 tw-text-gray-200 tw-animate-spin tw-dark:text-gray-600 tw-fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                </svg>
            </div>
        )}
        </>
    )
}