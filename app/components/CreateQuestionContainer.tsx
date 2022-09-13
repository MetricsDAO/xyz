import { useEffect, useState, useRef, Fragment } from "react";
import { useContractWrite } from "wagmi";
import { CheckmarkFilled32, CaretDown32 } from "@carbon/icons-react";
import { TransactionStatus } from "~/utils/helpers";
import { BigNumber } from "ethers";

import { Listbox, Transition } from "@headlessui/react";

import AlertBanner from "~/components/AlertBanner";
import { protocols } from "~/utils/helpers";

// TODO - paid endpoint

//https://ipfs.infura.io:5001

// let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
// let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei

export default function CreateQuestion({
  address,
  questionAPI,
  xmetric,
  costController,
  vault,
  network,
}: {
  address: string;
  questionAPI: Record<string, string>;
  xmetric: Record<string, string>;
  costController: Record<string, string>;
  vault: Record<string, string>;
  network: string;
}) {
  const [alertContainerStatus, setAlertContainerStatus] = useState<boolean>(false);
  const [writeTransactionStatus, setWriteTransactionStatus] = useState<string>(TransactionStatus.Pending);
  const [selectedProgram, setSelectedProgram] = useState(protocols[0]);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const questionBody = useRef<HTMLTextAreaElement | null>(null);
  const questionTitle = useRef<HTMLInputElement | null>(null);

    // With the migration to 0.6+ wagmi, they recommend preparing the transaction and
  // estimating gas and current fees prior to calling the actual event handler for a user
  // activating the function. However, the function needs to be called immediately pending the IPFS upload.
  // We have a bit of an anti pattern now with this being the flow, but, even with a 2 button process for
  // upload to ipfs -> start transaction, the usePrepareContractWrite is causing a crash. "Recklessly Unprepared"
  // allows the call to work as it previously did but we get shamed even though it's their package that is 
  // disfunctional: https://github.com/wagmi-dev/wagmi/discussions/880#discussioncomment-3516226

  // const { config } = usePrepareContractWrite({
  //     addressOrName: questionAPI.address,
  //     contractInterface: questionAPI.abi,
  //     functionName: "createQuestion",
  //     args: [fileUrl],
  //     // onError(err) {
  //     //   console.error(err);
  //     // },
  //     // onSettled(data, error) {
  //     //   console.log("Settled", { data, error });
  //     //   if (error) {
  //     //     setWriteTransactionStatus(TransactionStatus.Failed);
  //     //   }
  //     // },
  //     // onSuccess(data) {
  //     //   console.log("Success", data);
  //     // },
  // });

  const createQuestion = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: questionAPI.address,
    contractInterface: questionAPI.abi,
    functionName: "createQuestion",
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

  useEffect(() => {
    if (fileUrl) {
      askQuestion();
    }
  }, [fileUrl]);

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
  async function askQuestion() {
    console.log("fileURl", fileUrl);
    setButtonDisabled(true);
    try {
      const argumentsForWriteSync = network === "polygon" ? [fileUrl, BigNumber.from("10")] : [fileUrl];
      const txnResponse = await createQuestion.writeAsync({
        recklesslySetUnpreparedArgs: argumentsForWriteSync,
      });
      const confirmation = await txnResponse.wait();
      if (confirmation.blockNumber) {
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

  return (
    <>
      {alertContainerStatus && (
        <AlertBanner transactionStatus={writeTransactionStatus} setAlertContainerStatus={setAlertContainerStatus} />
      )}

      <section>
        <p className="tw-text-center tw-mb-8">Create question below</p>
        <div className="tw-mx-auto tw-max-w-md tw-mb-4">
          <label className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2" htmlFor="program-type">
            Program Type:
          </label>
          <div className="">
            <Listbox data-id="program-type" value={selectedProgram} onChange={setSelectedProgram}>
              <div className="tw-relative tw-mt-1">
                <Listbox.Button className="tw-relative tw-w-full tw-cursor-default tw-rounded-lg tw-bg-white tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-shadow-md tw-focus:outline-none tw-focus-visible:border-indigo-500 tw-focus-visible:ring-2 tw-focus-visible:ring-white tw-focus-visible:ring-opacity-75 tw-focus-visible:ring-offset-2 tw-focus-visible:ring-offset-orange-300 tw-sm:text-sm">
                  <span className="tw-block tw-truncate">{selectedProgram.name}</span>
                  <span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
                    <CaretDown32 className="tw-h-5 tw-w-5 tw-text-gray-400" aria-hidden="true" />
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
                            active ? "tw-bg-amber-100 tw-text-amber-900" : "tw-text-gray-900"
                          }`
                        }
                        value={protocol}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`tw-block tw-truncate ${selected ? "tw-font-medium" : "tw-font-normal"}`}>
                              {protocol.name}
                            </span>
                            {selected ? (
                              <span className="tw-absolute tw-items-center tw-inset-y-0 tw-left-0 tw-flex tw-tems-center tw-pl-3 tw-text-amber-600">
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
          <label className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2" htmlFor="question-title">
            Question Title:
          </label>
          <input
            ref={questionTitle}
            className="tw-block tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight tw-focus:outline-none tw-focus:shadow-outline"
            id="question-title"
            type="text"
            placeholder="e.g. L2's on Ethereum"
          />
        </div>
        <div className="tw-mx-auto tw-max-w-md tw-mb-4">
          <label className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2" htmlFor="question-body">
            Question Body:
          </label>
          <textarea
            ref={questionBody}
            rows={4}
            className="tw-block tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight tw-focus:outline-none tw-focus:shadow-outline"
            id="question-body"
            placeholder="e.g. Which tokens are most popular on the top 3 L2's by market share?"
          />
        </div>
        <div className="tw-mx-auto tw-max-w-md tw-mb-4">
          <button
            disabled={buttonDisabled}
            onClick={ipfsUpload}
            className="tw-bg-[#21C5F2] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white disabled:opacity-25"
          >
            Create Question
          </button>
        </div>
      </section>
    </>
  );
}
