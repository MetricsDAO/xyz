import { useLoaderData } from "remix";
import type { SetStateAction, Dispatch} from "react";
import { useEffect, useState, useRef } from "react";
import { useContractRead, useContractWrite, useProvider } from 'wagmi';
import { CheckmarkFilled32, CloseFilled32 } from '@carbon/icons-react';
import { BigNumber, utils } from "ethers";

import allocationGroups from "../../../allocationGroups.json";

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import ConnectWalletButton from "~/components/ConnectWalletButton";
import AlertBanner from "~/components/AlertBanner";





export async function loader() {
    let topChefJson;
    let metricJson;
    const network = "localhost";
    try {
        topChefJson = require(`core-evm-contracts/deployments/${network}/TopChef.json`);
        metricJson = require(`core-evm-contracts/deployments/${network}/MetricToken.json`);
    } catch (error) {
        console.log("ERROR", error);
        topChefJson = null;
        metricJson = null;
    }
    return {
        topChefJson,
        metricJson
    }
}

export default function Index() {
    const {topChefJson} = useLoaderData();

    function usePrevious(value:any) {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        },[value]);
        return ref.current;
    }

    function getIndexOfAllocator (address:string) {
        return allocationGroups.findIndex((obj) => {
            return utils.getAddress(obj.address) === address;
        })
    }


    function ShowMetric ({address}: {address: string}) {

        const [pendingHarvestEstimate, setPendingHarvestEstimate] = useState<number>(parseInt("0"));
        const [pendingClaimEstimate, setPendingClaimEstimate] = useState<number>(parseInt("0"));
        const [currentAllocationGroup, setCurrentAllocationGroup] = useState<any>(false);
        const [indexOfAllocation,] = useState<number>(getIndexOfAllocator(address))
        const prevAddress = usePrevious(address);


        //transactions
        const [alertContainerStatus, setAlertContainerStatus] = useState<boolean>(false);
        const [writeTransactionStatus, setWriteTransactionStatus] = useState<any>(null);

        const preWriteTransaction = usePrevious(writeTransactionStatus);




        const { data: contractData } = useContractRead({
            addressOrName: topChefJson.address,
            contractInterface: topChefJson.abi,
        }, 'getAllocationGroups', {
            enabled: prevAddress !== address,
            onError: (err) => {
              console.error(err);
            },
        });

        const { data: pendingHarvest } = useContractRead({
            addressOrName: topChefJson.address,
            contractInterface: topChefJson.abi,
        }, 'viewPendingHarvest', {
            args: [indexOfAllocation],
            enabled: (indexOfAllocation >= 0 && prevAddress !== address) || preWriteTransaction !== writeTransactionStatus,
            onError: (err) => {
              console.error(err);
            },
        });

        const { data: pendingClaims } = useContractRead({
            addressOrName: topChefJson.address,
            contractInterface: topChefJson.abi,
        }, 'viewPendingClaims', {
            args: [indexOfAllocation],
            enabled: (indexOfAllocation >= 0 && prevAddress !== address) || preWriteTransaction !== writeTransactionStatus,
            onError: (err) => {
              console.error(err);
            },
        });

        const harvest = useContractWrite({
            addressOrName: topChefJson.address,
            contractInterface: topChefJson.abi,
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
            addressOrName: topChefJson.address,
            contractInterface: topChefJson.abi,
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

        useEffect(() => {
            function isAddressEligible(data: any) {
                 let match = false;
                 data.forEach((accounts: any, index:number) => {
                    if (accounts[0] === address) {
                        match = accounts;
                    }
                });
                return match;
            }

            if (Array.isArray(contractData) && address !== prevAddress) {
                setCurrentAllocationGroup(isAddressEligible(contractData));
            }
        }, [address, contractData, prevAddress])

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
                    }, 10000);           
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
                    }, 10000);     
                }
            }
        }

        

        return (
                <>
                {alertContainerStatus && <AlertBanner transactionStatus={writeTransactionStatus} setAlertContainerStatus={setAlertContainerStatus} />}
                <div className="tw-mx-auto bg-white tw-p-6 tw-rounded-lg tw-w-1/3 tw-mb-7">
                    <div className="tw-mx-auto tw-flex tw-items-center tw-justify-center tw-mb-4">
                        {currentAllocationGroup ? (
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
                    </div>
                    <p className="tw-text-center">{currentAllocationGroup ? (
                    <span>The current address will be Eligible for vesting $METRIC</span>
                    ) : (
                        <span>The current address is not eligible for vesting $METRIC</span>
                    )}
                    </p>
                </div>

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

    /* ELEMENT CLONED IN WRAPPER */
    function ClaimBody({setIsOpen, account}: {setIsOpen?: Dispatch<SetStateAction<boolean>>, account?: any}) {
         return (
         <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
             <div className="tw-bg-white tw-rounded-full tw-w-[120px] tw-h-[120px] tw-flex tw-flex-col tw-justify-center tw-mx-auto">
             <img src="img/color-mark@2x.png" className="tw-mx-auto" alt="MetricsDAO" width="62" />
             </div>
             <h1 className="tw-text-5xl tw-mx-auto tw-pt-10 tw-pb-5 tw-font-bold">Vest Metric</h1>
             {account && account?.connector ? (
                 <ShowMetric address={account.address} />
             ) : (
             <ConnectWalletButton marginAuto buttonText="Connect Wallet to Vest" connectWallet={setIsOpen} />
             )
         }
         </section>
         )
     }

    return (
    <WalletProvider>
        <Wrapper >
            <ClaimBody /> 
        </Wrapper>
    </WalletProvider>   
    )
}



