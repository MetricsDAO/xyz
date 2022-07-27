import { useEffect, useState, Fragment} from "react";
import type { Dispatch, SetStateAction} from "react";
import { useContractRead, useContractWrite } from 'wagmi';
import { BigNumber, utils } from "ethers";
import AlertBanner from "~/components/AlertBanner";
import { TransactionStatus, usePrevious } from '~/utils/helpers';
import { RadioGroup } from '@headlessui/react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckmarkFilled32, CaretDown32 } from '@carbon/icons-react';

import ShowQuestions  from "~/components/ShowQuestions";

const questionStateEnum = {
    UNINIT: 0,
    VOTING: 1,
    PUBLISHED: 2,
    IN_GRADING: 3,
    COMPLETED: 4,
    CANCELLED: 5,
    BAD: 6,
};

const OFFSET = 1000;

const sortMethods = [
  {
    name: 'Votes',
  //   ram: '12GB',
  //   cpus: '6 CPUs',
  //   disk: '160 GB SSD disk',
  },
  {
    name: 'Newest',
  //   ram: '16GB',
  //   cpus: '8 CPUs',
  //   disk: '512 GB SSD disk',
  },
  {
    name: 'Program',
  //   ram: '32GB',
  //   cpus: '12 CPUs',
  //   disk: '1024 GB SSD disk',
  },
];

const protocols = [
  { name: 'All'},
  { name: 'Ethereum' },
  { name: 'Flow' },
  { name: 'Algorand' },
  { name: 'THOchain' },
  { name: 'Cosmos' },
  { name: 'Polygon' },
]
  
function MyRadioGroup({setSelected, selected}: {setSelected: Dispatch<SetStateAction<any>>, selected:any}) {
    // const [selected, setSelected] = useState(sortMethods[0])
  
    return (
        <div className="tw-mx-auto tw-w-full tw-max-w-md tw-mb-8">
          <RadioGroup value={selected} onChange={setSelected}>
            <RadioGroup.Label className="">Sort By</RadioGroup.Label>
            <div className="tw-space-y-2">
              {sortMethods.map((plan) => (
                <RadioGroup.Option
                  key={plan.name}
                  value={plan}
                  className={({ active, checked }) =>
                    `${
                      active
                        ? 'tw-ring-2 tw-ring-white tw-ring-opacity-60 tw-ring-offset-2 tw-ring-offset-sky-300'
                        : ''
                    }
                    ${
                      checked ? 'tw-bg-sky-900 tw-bg-opacity-75 tw-text-white' : 'tw-bg-white'
                    }
                      tw-relative tw-flex tw-cursor-pointer tw-rounded-lg tw-px-5 tw-py-4 tw-shadow-md tw-focus:outline-none`
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <div className="tw-flex tw-w-full tw-items-center tw-justify-between">
                        <div className="tw-flex tw-items-center tw-pr-4">
                          <div className="text-sm">
                            <RadioGroup.Label
                              as="p"
                              className={`tw-font-medium  ${
                                checked ? 'tw-text-white' : 'tw-text-gray-900'
                              }`}
                            >
                              {plan.name}
                            </RadioGroup.Label>
                          </div>
                        </div>
                        {checked && (
                          <div className="tw-shrink-0 tw-text-white">
                            <CheckIcon className="tw-h-6 tw-w-6" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
    )
}
  
function CheckIcon(props:any) {
    return (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
        <path
          d="M7 13l3 3 7-7"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
}

function DropDown({selectedProgram, setSelectedProgram}: {selectedProgram: any, setSelectedProgram: any}) {
  return (
    <>
    <h1>Filter By:</h1>
    <Listbox data-id="program-type" value={selectedProgram} onChange={setSelectedProgram}>
    <div className="tw-relative tw-mt-1">
        <Listbox.Button className="tw-relative tw-w-full tw-cursor-default tw-rounded-lg tw-bg-white tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-shadow-md tw-focus:outline-none tw-focus-visible:border-indigo-500 tw-focus-visible:ring-2 tw-focus-visible:ring-white tw-focus-visible:ring-opacity-75 tw-focus-visible:ring-offset-2 tw-focus-visible:ring-offset-orange-300 tw-sm:text-sm">
        <span className="tw-block tw-truncate">{selectedProgram.name}</span>
        <span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
            <CaretDown32
            className="tw-h-5 tw-w-5 tw-text-gray-400"
            aria-hidden="true"
            />
        </span>
        </Listbox.Button>
        <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        >
        <Listbox.Options className="tw-absolute tw-mt-1 tw-max-h-60 tw-w-full tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1 tw-text-base tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-focus:outline-none tw-sm:text-sm">
            {protocols.map((protocol, index) => (
            <Listbox.Option
                key={index}
                className={({ active }) =>
                `tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-10 tw-pr-4 ${
                    active ? 'tw-bg-amber-100 tw-text-amber-900' : 'tw-text-gray-900'
                }`
                }
                value={protocol}
            >
                {({ selected }) => (
                <>
                    <span
                    className={`tw-block tw-truncate ${
                        selected ? 'tw-font-medium' : 'tw-font-normal'
                    }`}
                    >
                    {protocol.name}
                    </span>
                    {selected ? (
                    <span className="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-tems-center tw-pl-3 tw-text-amber-600">
                        <CheckmarkFilled32 className="tw-h-5 tw-w-5" aria-hidden="true" />
                    </span>
                    ) : null}
                </>
                )}
            </Listbox.Option>
            ))}
        </Listbox.Options>
        </Transition>
    </div>
    </Listbox>
    </>
  )
}

function AllQuestionsByState ({latestQuestion, questionStateController, questionAPI}: {latestQuestion:number, questionStateController: Record<string, string>, questionAPI: Record<string, string>}) {
  const [questionDataVotingState, setQuestionDataVotingState] = useState<any>([]);
  const [querstionArray, setQuestionArray] = useState<any>([]);
  const [uxShow, setUXToShow] = useState<boolean>(false);
  const [alertContainerStatus, setAlertContainerStatus] = useState<boolean>(false);
  const [writeTransactionStatus, setWriteTransactionStatus] = useState<string>(TransactionStatus.Pending);

  const [selected, setSelected] = useState(sortMethods[0]);

  const [selectedProgram, setSelectedProgram] = useState(protocols[0]);

  const prevTokenId = usePrevious(latestQuestion);

  const {data: questionData} = useContractRead({
    addressOrName: questionStateController.address,
    contractInterface: questionStateController.abi,
}, 'getQuestionsByState', {
    args: [BigNumber.from(questionStateEnum.VOTING), BigNumber.from(latestQuestion), BigNumber.from(OFFSET)],
    enabled: prevTokenId !== latestQuestion,
    onError: (err) => {
      console.error(err);
    },
  });

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
    if (Array.isArray(questionData) && prevTokenId !== latestQuestion) {
        setQuestionDataVotingState(questionData);
    }
  }, [questionData,  questionDataVotingState, prevTokenId, latestQuestion])

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
        setQuestionArray((existingQuestion: any) => [...existingQuestion, ipfsData]);
        } catch (error:any) {
            const ipfsdataFailure = {
                name: "Unavailable currently",
                program: {
                    name: "Unavailable currently"
                },
                description: "Unavailable currently",
                url: obj.url,
                questionId: obj.questionId.toNumber(),
                totalVotes: utils.formatEther(obj.totalVotes.toString())
            };
            if (error.name === 'AbortError') return
            setQuestionArray((existingQuestion: any) => [...existingQuestion, ipfsdataFailure]);
        }
    }
    if (questionDataVotingState.length) {
        for (let i=0; i<questionDataVotingState.length; i++) {
            if (questionDataVotingState[i].url) {
                getIpfsdata(questionDataVotingState[i])
            }
        }
    }
    return () => ac.abort();
  }, [questionDataVotingState])

  useEffect(() => {
    if (querstionArray.length && querstionArray.length === questionDataVotingState.length) {
        setUXToShow(true);
    }
  }, [querstionArray, questionDataVotingState]);

  async function upvoteQuestion(questionId: number) {
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
                  upvoteQuestion={upvoteQuestion} 
                  />
          </div>
          <div className="tw-w-1/6 tw-px-4">
          <MyRadioGroup setSelected={setSelected} selected={selected} />
          <DropDown setSelectedProgram={setSelectedProgram} selectedProgram={selectedProgram} />
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

export default function AllQuestionContainer ({address, questionAPI, xmetric, questionStateController}: {address: string, questionAPI: Record<string, string>, xmetric: Record<string, string>, questionStateController: Record<string, string> }) {
    const [xmetricAmount, setxmetricAmount] = useState<string>("");

    const [latestTokenId, setLatestTokenId] = useState<number>(0);
    
    const prevAddress = usePrevious(address);

    const {data: balanceData} = useContractRead({
        addressOrName: xmetric.address,
        contractInterface: xmetric.abi,
    }, 'balanceOf', {
        args: [address],
        enabled: prevAddress !== address,
        onError: (err) => {
          console.error(err);
        },
    });

    const {data: currentQuestion} = useContractRead({
        addressOrName: questionAPI.address,
        contractInterface: questionAPI.abi,
    }, 'currentQuestionId', {
        enabled: prevAddress !== address,
        onError: (err) => {
          console.error(err);
        },
    });

    useEffect(() => {
        if (BigNumber.isBigNumber(balanceData)) {
            console.log("metric Amount", utils.formatEther(balanceData.toString()));
            setxmetricAmount(utils.formatEther(balanceData.toString()));
        }
    }, [balanceData])

    useEffect(() => {
        if (BigNumber.isBigNumber(currentQuestion)) {
            console.log("latest question ID", currentQuestion.toNumber());
            setLatestTokenId(currentQuestion.toNumber());
        }
    }, [currentQuestion])

    return (
            <>
            <div className="tw-mx-auto bg-white tw-p-6 tw-rounded-lg tw-w-1/3 tw-mb-7">
                <p className="tw-text-center">{parseInt(xmetricAmount) > 0 ? (
                <span>You have {xmetricAmount} xMETRIC available to create or vote on questions</span>
                ) : (
                    <span>You currently don't have any xMETRIC to create or vote on questions.</span>
                )}
                </p>
            </div>
            <section className="tw-mx-auto tw-mb-7 tw-container tw-max-w-screen-xl">
              {latestTokenId && (
                <AllQuestionsByState 
                  questionAPI={questionAPI} 
                  latestQuestion={latestTokenId} 
                  questionStateController={questionStateController} 
                />
              )}
            </section>
            </>

    )
}