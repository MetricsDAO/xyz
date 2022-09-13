import { useEffect, useState } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { BigNumber, utils } from "ethers";

import { usePrevious, TransactionStatus } from "~/utils/helpers";
import AlertBanner from "~/components/AlertBanner";

export default function ShowMetric({
  indexOfAllocation,
  prevAddress,
  address,
  topChef,
}: {
  indexOfAllocation: number;
  prevAddress: string | undefined;
  address: string;
  topChef: Record<string, string>;
}) {
  const [pendingRewardsEstimate, setPendingRewardsEstimate] = useState<number>(
    parseInt("0")
  );

  //transactions
  const [alertContainerStatus, setAlertContainerStatus] =
    useState<boolean>(false);
  const [writeTransactionStatus, setWriteTransactionStatus] = useState<string>(
    TransactionStatus.Pending
  );
  const preWriteTransaction = usePrevious(writeTransactionStatus);

  const { data: pendingRewards } = useContractRead({
    addressOrName: topChef.address,
    contractInterface: topChef.abi,
    functionName: "viewPendingRewards",
    args: [indexOfAllocation],
    enabled: true, // prevAddress !== address || preWriteTransaction !== writeTransactionStatus,
    watch: true,
    onError: (err) => {
      console.error(err);
    },
  });

  const claim = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: topChef.address,
    contractInterface: topChef.abi,
    functionName: "claim",
    args: [indexOfAllocation],
    onError: (err) => {
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
    if (BigNumber.isBigNumber(pendingRewards)) {
      console.log("pending rewards", utils.formatEther(pendingRewards));
      setPendingRewardsEstimate(parseInt(utils.formatEther(pendingRewards)));
    }
  }, [pendingRewards]);

  async function claimRewards() {
    if (indexOfAllocation >= 0) {
      setWriteTransactionStatus(TransactionStatus.Pending);
      setAlertContainerStatus(true);
      const txnResponse = await claim.writeAsync();
      const confirmation = await txnResponse.wait();
      if (confirmation.blockNumber) {
        setWriteTransactionStatus(TransactionStatus.Approved);
        setTimeout(() => {
          setAlertContainerStatus(false);
        }, 9000);
      }
    }
  }
  return (
    <>
      {alertContainerStatus && (
        <AlertBanner
          transactionStatus={writeTransactionStatus}
          setAlertContainerStatus={setAlertContainerStatus}
        />
      )}
      {pendingRewardsEstimate && (
        <div className="tw-mx-auto bg-white tw-p-6 tw-rounded-lg tw-w-1/3 tw-mb-7">
          <div className="tw-mx-auto tw-justify-between tw-items-center tw-flex-wrap tw-flex tw-mb-4">
            <p className="tw-w-full tw-text-small">pending rewards (METRIC)</p>
            <h4 className="tw-font-semibold tw-text-2xl">
              {pendingRewardsEstimate}
            </h4>
            {pendingRewardsEstimate > 0 && (
              <button
                onClick={() => claimRewards()}
                className="tw-bg-[#21C5F2] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white"
              >
                Collect
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
