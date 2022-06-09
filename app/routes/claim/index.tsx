import { useLoaderData } from "remix";
import { SetStateAction, Dispatch, ReactElement } from "react";
import { useContractRead } from 'wagmi';
import { utils } from "ethers";

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import ConnectWalletButton from "~/components/ConnectWalletButton";


export async function loader() {
    let topChefJson;
    let metricJson;
    try {
        topChefJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/TopChef.json`);
        metricJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/MetricToken.json`);
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
    const {topChefJson, metricJson} = useLoaderData();

    function ShowMetric ({address}: {address: string}) {
        console.log('address', address)
        const { data: contractData } = useContractRead({
            addressOrName: topChefJson.address,
            contractInterface: topChefJson.abi,
        }, 'getAllocationGroups',     {
            onError: (err) => {
              console.error(err);
            },
          });

        const { data: totalSupply } = useContractRead({
            addressOrName: metricJson.address,
            contractInterface: metricJson.abi,
        }, 'totalSupply', {
            onError: (err) => {
                console.error(err);
              },
        });
        function doesUserHaveMetric() {
            const found = Array.isArray(contractData) && contractData.find((accounts) => {
                if (accounts[0] === address) {
                    return accounts
                } else {
                    return null;
                }
            });
            return (
                <>
                <p>{found ? "Eligible" : "Not Eligible"} for Vesting</p>
                <p>{found ? `${utils.formatEther(found[1])} $METRIC has vested out of a total ${totalSupply && utils.formatEther(totalSupply)} $METRIC` : (
                    "You have no $METRIC available to vest in the connected wallet."
                )}
                </p>
                </>
            )
        }
        return (
            <div className="tw-mx-auto bg-white tw-w[440px] ">
                {doesUserHaveMetric()}
            </div>
        )
    }

    function ClaimBody({setIsOpen, selectWalletObj, children}: {selectWalletObj?: any, setIsOpen?: Dispatch<SetStateAction<boolean>>, children?: ReactElement}) {
        const { account } = selectWalletObj;


         return (
         <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
             <div className="tw-bg-white tw-rounded-full tw-w-[120px] tw-h-[120px] tw-flex tw-flex-col tw-justify-center tw-mx-auto">
             <img src="img/color-mark@2x.png" className="tw-mx-auto" alt="MetricsDAO" width="62" />
             </div>
             <h1 className="tw-text-5xl tw-mx-auto tw-pt-10 tw-pb-5 tw-font-bold">Vest Metric</h1>
             {account ? (
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
        <Wrapper contractJson={topChefJson} >
            <ClaimBody />
        </Wrapper>
    </WalletProvider>   
    )
}



