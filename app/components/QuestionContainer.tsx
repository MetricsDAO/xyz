import { useEffect, useState, useRef, Fragment} from "react";
import { useContractRead, useContractWrite } from 'wagmi';
import { create } from "ipfs-http-client";
import { BigNumber, utils } from "ethers";
import { CheckmarkFilled32, CaretDown32 } from '@carbon/icons-react';
import { usePrevious, TransactionStatus } from '~/utils/helpers';

import { Listbox, Transition } from '@headlessui/react'

import AlertBanner from "~/components/AlertBanner";


const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });
const protocols = [
    { name: 'Ethereum' },
    { name: 'Flow' },
    { name: 'Algorand' },
    { name: 'THOchain' },
    { name: 'Cosmos' },
    { name: 'Polygon' },
  ]

export default function ShowUser ({address, questionAPI, xmetric, costController}: {address: string, questionAPI: Record<string, string>, xmetric: Record<string, string>, costController: Record<string, string> }) {
        const [xmetricAmount, setxmetricAmount] = useState<string>("");
        const [questionCost, setQuestionCost] = useState<string>("");
        const [alertContainerStatus, setAlertContainerStatus] = useState<boolean>(false);
        const [writeTransactionStatus, setWriteTransactionStatus] = useState<string>(TransactionStatus.Pending);
        // const [indexOfAllocation, setIndexAllocation] = useState<number>(-1)
        const [selectedProgram, setSelectedProgram] = useState(protocols[0]);
        const [fileUrl, setFileUrl] = useState<any>();
        const prevAddress = usePrevious(address);

        const questionBody = useRef<any>();
        const questionTitle = useRef<any>();

        const {data: balanceData} = useContractRead({
            addressOrName: xmetric.address,
            contractInterface: xmetric.abi,
        }, 'balanceOf', {
            args: [address],
            enabled: true,
            watch: true,
            onError: (err) => {
              console.error(err);
            },
        });

        const createQuestion = useContractWrite({
            addressOrName: questionAPI.address,
            contractInterface: questionAPI.abi,
        }, 'createQuestion', {
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

        const {data: createCost } = useContractRead({
            addressOrName: costController.address,
            contractInterface: costController.abi,
        }, 'createCost', {
            enabled: true,
            onError: (err) => {
              console.error(err);
            },
        });

        const approve =  useContractWrite({
            addressOrName: xmetric.address,
            contractInterface: xmetric.abi,
        }, 'approve', {
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
            //   overrides: {
            //     gasLimit: 10000000,
            //     gasPrice: 10000000,
            //   },
        });

        useEffect(() => {
            if (BigNumber.isBigNumber(balanceData)) {
                console.log("data", utils.formatEther(balanceData.toString()));
                setxmetricAmount(utils.formatEther(balanceData.toString()));
            }
        }, [balanceData])

        useEffect(() => {
            if (BigNumber.isBigNumber(createCost)) {
                console.log("data", utils.formatEther(createCost.toString()));
                setQuestionCost(utils.formatEther(createCost.toString()));
            }
        }, [createCost])

        useEffect(() => {
            if (fileUrl) {
                askQuestion();  
            }
        }, [fileUrl])

        async function ipfsUpload () {
            setWriteTransactionStatus(TransactionStatus.Pending);
            setAlertContainerStatus(true);
            const questionBodyValue = questionBody.current.value;
            const questionTitleValue = questionTitle.current.value;

            const jsonMetaData = {
                "name": questionTitleValue,
                "description": questionBodyValue,
                "program" : selectedProgram,
            };
            console.log('meta', jsonMetaData);
            try {
                const added = await client.add(JSON.stringify(jsonMetaData));
                setFileUrl("https://ipfs.io/ipfs/" + added.path);
            } catch(error) {
                console.error('err!', error);
                setFileUrl(false);
            }       
            
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        async function askQuestion () {
            console.log("test", utils.parseEther(questionCost));
            const approvetxnResponse = await approve.writeAsync({
                args: [costController.address, utils.parseEther(questionCost)],
                overrides: {
                    gasLimit: 350000,
                  },
              });

            console.log("approvetxnResponse", approvetxnResponse )
            const approveconfirmation = await approvetxnResponse.wait();


            console.log("approveconfirmation", approveconfirmation )

            if (approveconfirmation.blockNumber) {
                console.log("fileURl", fileUrl);
                const txnResponse = await createQuestion.writeAsync({
                    overrides: {
                        gasLimit: 10000000,
                      },
                    args: [fileUrl, BigNumber.from("10")]
                });
                console.log("txnResponse", txnResponse);
                try {
                    const confirmation = await txnResponse.wait();
                    console.log("confirmation", confirmation);
                    if (confirmation.blockNumber) {
                        setWriteTransactionStatus(TransactionStatus.Approved);
                        setTimeout(() => {
                            setAlertContainerStatus(false);
                        }, 9000);     
                    }
                } catch(error) {
                    console.error("ERRRR", error);
                    setWriteTransactionStatus(TransactionStatus.Failed);
                }

            }
            

        }

        return (
                <>
                {alertContainerStatus && <AlertBanner transactionStatus={writeTransactionStatus} setAlertContainerStatus={setAlertContainerStatus} />}
                <div className="tw-mx-auto bg-white tw-p-6 tw-rounded-lg tw-w-1/3 tw-mb-7">
                    {/* <div className="tw-mx-auto tw-flex tw-items-center tw-justify-center tw-mb-4">
                        {currentAllocationGroup.length ? (
                        <>
                        <CheckmarkFilled32 className="tw-fill-[#66B75F] tw-inline" /> 
                        <h3 className="tw-text-2xl tw-inline tw-pl-2 tw-font-semibold">Eligible for Vesting</h3> 
                        </> 
                        ) : 
                        <> 
                        <CloseFilled32 className="tw-fill-[#F7746D] tw-inline" />
                        <h3 className="tw-text-2xl tw-inline tw-pl-2">Not Eligible for vesting</h3>
                        </>
                        } 
                    </div> */}
                    <p className="tw-text-center">{parseInt(xmetricAmount) > 0 ? (
                    <span>You have {xmetricAmount} xMETRIC available to create or vote on questions</span>
                    ) : (
                        <span>You currently don't have any xMETRIC to create or vote on questions.</span>
                    )}
                    </p>
                </div>
                {/* {currentAllocationGroup.length && indexOfAllocation >= 0 && (
                <ShowMetric 
                    topChef={topChef} 
                    address={address} 
                    prevAddress={prevAddress} 
                    indexOfAllocation={indexOfAllocation} 
                />
                )} */}
                {parseInt(xmetricAmount) > 0 && (
                    <section>
                        <p className="tw-text-center tw-mb-8">Create question below</p>
                        <div className="tw-mx-auto tw-max-w-md tw-mb-4">
                            <label className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2" htmlFor="program-type">Program Type:</label>
                            <div className="">
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
                            </div>
                        </div>
                        <div className="tw-mx-auto tw-max-w-md tw-mb-4">
                        <label className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2" htmlFor="question-title">Question Title:</label>
                        <input ref={questionTitle} className="tw-block tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight tw-focus:outline-none tw-focus:shadow-outline" id="question-title" type="text" placeholder="e.g. L2's on Ethereum"/>
                        </div>
                        <div className="tw-mx-auto tw-max-w-md tw-mb-4">
                        <label className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2" htmlFor="question-body">Question Body:</label>
                        <textarea ref={questionBody} rows={4} className="tw-block tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight tw-focus:outline-none tw-focus:shadow-outline" id="question-body" placeholder="e.g. Which tokens are most popular on the top 3 L2's by market share?"/>
                        </div>
                        <div className="tw-mx-auto tw-max-w-md tw-mb-4">
                        <button onClick={() => ipfsUpload()}className="tw-bg-[#21C5F2] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white">
                            Create Question
                        </button>
                        </div>
                    </section>
                )}

                </>

        )
    }