import { useEffect, useState, useRef, Fragment, useContext } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ArrowLeft32, ChevronDown32 } from "@carbon/icons-react";
import { TransactionStatus, protocols, truncateAddress } from "~/utils/helpers";
import type { ContractContextEntity } from "~/utils/types";
import { BigNumber } from "ethers";

import { Listbox, Transition } from "@headlessui/react";

import AlertBanner from "~/components/AlertBanner";
import { ContractContext } from "~/components/ContractContextWrapper";

// TODO - paid endpoint

//https://ipfs.infura.io:5001

// let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
// let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei

export default function CreateQuestionContainer({ address }: { address?: string }) {
  const [alertContainerStatus, setAlertContainerStatus] = useState<boolean>(false);
  const [writeTransactionStatus, setWriteTransactionStatus] = useState<string>(TransactionStatus.Pending);
  const [selectedProgram, setSelectedProgram] = useState(protocols[0]);
  const [fileUrl, setFileUrl] = useState<string>();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const questionBody = useRef<HTMLTextAreaElement | null>(null);
  const questionTitle = useRef<HTMLInputElement | null>(null);

  const { contracts, network }: ContractContextEntity = useContext(ContractContext);

  const { config, isSuccess } = usePrepareContractWrite({
    addressOrName: contracts.questionAPI.address,
    contractInterface: contracts.questionAPI.abi,
    functionName: "createQuestion",
    args: network === "polygon" ? [fileUrl, BigNumber.from("10")] : [fileUrl],
    enabled: Boolean(fileUrl),
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

  useEffect(() => {
    async function askQuestion() {
      console.log("fileURl", fileUrl);
      setButtonDisabled(true);
      try {
        const txnResponse = await writeAsync?.();
        const confirmation = await txnResponse?.wait();
        if (confirmation?.blockNumber) {
          setWriteTransactionStatus(TransactionStatus.Approved);
          if (questionBody.current) {
            questionBody.current.value = "";
          }
          if (questionTitle.current) {
            questionTitle.current.value = "";
          }
          setSelectedProgram(protocols[0]);
          setButtonDisabled(false);
          setTimeout(() => {
            setAlertContainerStatus(false);
          }, 9000);
        }
      } catch (error) {
        console.error("ERRRR", error);
        setButtonDisabled(false);
        setWriteTransactionStatus(TransactionStatus.Failed);
      }
    }

    if (isSuccess) {
      askQuestion();
    }
  }, [isSuccess, writeAsync, fileUrl]);

  async function ipfsUpload() {
    const questionBodyValue = questionBody.current?.value ?? "";
    const questionTitleValue = questionTitle.current?.value ?? "";
    if (questionTitleValue?.length < 1 || questionBodyValue?.length < 10) {
      // old school
      alert("Make sure you add a title and enough characters for the question body");
      return false;
    }

    setWriteTransactionStatus(TransactionStatus.Pending);
    setAlertContainerStatus(true);

    const jsonMetaData = {
      author: address,
      name: questionTitleValue,
      description: questionBodyValue,
      program: selectedProgram?.name,
      date: Date.now(),
    };

    console.log("meta", jsonMetaData);
    try {
      const ipfs = await fetch("/api/meta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonMetaData),
      });
      const apiJson = await ipfs.json();
      setFileUrl(apiJson.path);
    } catch (error) {
      console.error("err!", error);
      setFileUrl("");
    }
  }

  return (
    <>
      {alertContainerStatus && (
        <AlertBanner transactionStatus={writeTransactionStatus} setAlertContainerStatus={setAlertContainerStatus} />
      )}

      <section>
        <div className="tw-flex">
          <a href="/all-questions" target="_self" rel="noreferrer">
            <ArrowLeft32 className="tw-text-[#454F5B] tw-mr-5 tw-mt-0.5" />
          </a>
          <div className="tw-flex tw-flex-col tw-justify-start tw-basis-3/4">
            <div className="tw-flex tw-flex-row">
              <p className="tw-text-left tw-mb-3 tw-text-black tw-text-3xl tw-font-bold tw-pr-5">Create question</p>
              {address ? (
                <span className="tw-text-sm tw-text-[#637381] tw-mt-3 tw-ml-auto">{truncateAddress(address)}</span>
              ) : (
                <p></p>
              )}
            </div>
            <div className="tw-mb-4">
              <label className="tw-block tw-text-[#2C2E30] tw-text-sm tw-font-bold tw-mb-2" htmlFor="question-title">
                Question Title:
              </label>
              <input
                ref={questionTitle}
                className="tw-block tw-w-full tw-appearance-none tw-border tw-rounded tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight tw-focus:outline-none tw-focus:shadow-outline"
                id="question-title"
                type="text"
                placeholder="Title name"
              />
            </div>
            <div className="tw-mb-4">
              <label className="tw-block tw-text-[#2C2E30] tw-text-sm tw-font-bold tw-mb-2" htmlFor="program-type">
                Project:
              </label>
              <div>
                <Listbox data-id="program-type" value={selectedProgram} onChange={setSelectedProgram}>
                  <div className="tw-relative tw-mt-1">
                    <Listbox.Button className="tw-relative tw-w-full tw-border tw-cursor-default tw-rounded-lg tw-bg-white tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-focus:outline-none tw-focus-visible:border-indigo-500 tw-focus-visible:ring-2 tw-focus-visible:ring-white tw-focus-visible:ring-opacity-75 tw-focus-visible:ring-offset-2 tw-focus-visible:ring-offset-orange-300 tw-sm:text-sm">
                      <span className="tw-block tw-truncate">{selectedProgram.name}</span>
                      <span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
                        <ChevronDown32 className="tw-h-5 tw-w-5 tw-text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="tw-absolute tw-mt-1 tw-max-h-60 tw-w-full tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1 tw-text-base tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-focus:outline-none tw-sm:text-sm">
                        {protocols.map((protocol, index) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) =>
                              `tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-10 tw-pr-4 ${
                                active ? "tw-bg-[#f0f4fc] tw-text-[#2563EB]" : "tw-text-gray-900"
                              }`
                            }
                            value={protocol}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`tw-block tw-truncate ${selected ? "tw-font-medium" : "tw-font-normal"}`}
                                >
                                  {protocol.name}
                                </span>
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
            <div className="tw-mb-4">
              <label className="tw-block tw-text-[#2C2E30] tw-text-sm tw-font-bold tw-mb-2" htmlFor="question-body">
                Question:
              </label>
              <textarea
                ref={questionBody}
                rows={4}
                className="tw-block tw-appearance-none tw-border tw-resize-none tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight tw-focus:outline-none tw-focus:shadow-outline"
                id="question-body"
                placeholder="Type to get started"
              />
            </div>
            <p className="tw-text-[#A0A3A6] tw-text-sm tw-mb-10">
              Remember to be specific with your question. Never assume that someone will “Know what you mean.” Be
              specific, Define metrics, specifiy time boundaries.
            </p>
            <div className="tw-mb-12">
              <button
                disabled={!address}
                onClick={ipfsUpload}
                className="tw-bg-black tw-w-full tw-py-3 tw-text-sm tw-rounded-lg tw-text-white disabled:opacity-25"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
