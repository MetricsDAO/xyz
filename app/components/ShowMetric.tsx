import { useEffect, useState } from "react";
import { useContractRead, useContractWrite } from 'wagmi';
import { BigNumber, utils } from "ethers";

import { usePrevious } from '~/utils/helpers';
import AlertBanner from "~/components/AlertBanner";

export default function ShowMetric ({currentAllocationGroup, indexOfAllocation, prevAddress, address, topChef}: {currentAllocationGroup:any, indexOfAllocation: number, prevAddress: any, address: string, topChef: any}) {
    const [pendingHarvestEstimate, setPendingHarvestEstimate] = useState<number>(parseInt("0"));
    const [pendingClaimEstimate, setPendingClaimEstimate] = useState<number>(parseInt("0"));

    //transactions
    const [alertContainerStatus, setAlertContainerStatus] = useState<boolean>(false);
    const [writeTransactionStatus, setWriteTransactionStatus] = useState<any>(null);
    const preWriteTransaction = usePrevious(writeTransactionStatus);


    const { data: pendingHarvest } = useContractRead({
        addressOrName: topChef.address,
        contractInterface: topChef.abi,
    }, 'viewPendingHarvest', {
        args: [indexOfAllocation],
        enabled: (indexOfAllocation >= 0 && prevAddress !== address) || preWriteTransaction !== writeTransactionStatus,
        onError: (err) => {
          console.error(err);
        },
    });

    const { data: pendingClaims } = useContractRead({
        addressOrName: topChef.address,
        contractInterface: topChef.abi,
    }, 'viewPendingClaims', {
        args: [indexOfAllocation],
        enabled: (indexOfAllocation >= 0 && prevAddress !== address) || preWriteTransaction !== writeTransactionStatus,
        onError: (err) => {
          console.error(err);
        },
    });

    const harvest = useContractWrite({
        addressOrName: topChef.address,
        contractInterface: topChef.abi,
    }, 'harvest', {
        args: [indexOfAllocation],
        onError: (err) => {
            console.error(err);
          },
          onSettled(data, error) {
            console.log('Settled', { data, error })
            if (error) {
                setWriteTransactionStatus(false);
            }
          },
          onSuccess(data) {
            console.log("onsuccess", data);
          },
          onMutate({ args, overrides }) {
            console.log('Mutate', { args, overrides })
          },
    });

    const claim = useContractWrite({
        addressOrName: topChef.address,
        contractInterface: topChef.abi,
    }, 'claim', {
        args: [indexOfAllocation],
        onError: (err) => {
            console.error(err);
          },
          onSettled(data, error) {
            console.log('Settled', { data, error })
            if (error) {
                setWriteTransactionStatus(false);
            }
          },
          onSuccess(data) {
            console.log('Success', data)
          },
          onMutate({ args, overrides }) {
            console.log('Mutate', { args, overrides })
          },
    });

    useEffect(() => {
        if (BigNumber.isBigNumber(pendingHarvest)) {
            setPendingHarvestEstimate(parseInt(utils.formatEther(pendingHarvest)));
        }
    }, [pendingHarvest]);

    useEffect(() => {
        if (BigNumber.isBigNumber(pendingClaims)) {
            setPendingClaimEstimate(parseInt(utils.formatEther(pendingClaims)))
        }
    }, [pendingClaims] );

    async function harvestRewards () {
        if (indexOfAllocation >= 0) {
            setWriteTransactionStatus(null);
            setAlertContainerStatus(true);
            const txnResponse = await harvest.writeAsync();
            console.log('txnResponse', txnResponse);
            const confirmation = await txnResponse.wait();
            console.log("confirmation wait", confirmation);
            if (confirmation.blockNumber) {
                setWriteTransactionStatus(true);
                setTimeout(() => {
                    setAlertContainerStatus(false);
                }, 9000);           
            }
        }
    }

    async function claimRewards () {
        if (indexOfAllocation >= 0) {
            setWriteTransactionStatus(null);
            setAlertContainerStatus(true);
            const txnResponse = await claim.writeAsync();
            console.log('txnResponse', txnResponse);
            const confirmation = await txnResponse.wait();
            console.log("confirmation wait claim", confirmation);
            if (confirmation.blockNumber) {
                setWriteTransactionStatus(true);
                setTimeout(() => {
                    setAlertContainerStatus(false);
                }, 9000);     
            }
        }
    }
    return (
        <>
        {alertContainerStatus && <AlertBanner transactionStatus={writeTransactionStatus} setAlertContainerStatus={setAlertContainerStatus} />}
        {pendingHarvestEstimate && (
            <div className="tw-mx-auto bg-white tw-p-6 tw-rounded-lg tw-w-1/3 tw-mb-7">    
                <div className="tw-mx-auto tw-justify-between tw-items-center tw-flex-wrap tw-flex tw-mb-4">
                    <p className="tw-w-full tw-text-small">pending harvest (METRIC)</p>
                    <h4 className="tw-font-semibold tw-text-2xl">{pendingHarvestEstimate}</h4>
                    {pendingHarvestEstimate > 0 && (
                        <button onClick={() => harvestRewards()}className="tw-bg-[#21C5F2] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white">
                            Harvest Rewards
                        </button>
                    )}
                </div>
                {currentAllocationGroup?.autodistribute === false && (
                <div className="tw-mx-auto tw-justify-between tw-items-center tw-flex-wrap tw-flex tw-mb-4">
                    <p className="tw-w-full tw-text-small">pending claims (METRIC)</p>
                    <h4 className="tw-font-semibold tw-text-2xl">{pendingClaimEstimate}</h4>
                    {pendingClaimEstimate > 0 && (
                        <button onClick={() => claimRewards()}className="tw-bg-[#21C5F2] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white">
                            Claim Rewards
                        </button>
                    )}
                </div>
                )}
            </div>
        )}
        </>
    )
}