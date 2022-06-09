import { useLoaderData } from "remix";
import { SetStateAction, Dispatch, ReactElement, useEffect } from "react";
import { useContractRead } from 'wagmi';

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import ConnectWalletButton from "~/components/ConnectWalletButton";


export async function loader() {
    let contractData
    try {
        contractData = require(`core-evm-contracts/deployments/${process.env.NETWORK}/TopChef.json`);
    } catch (error) {
        console.log("ERROR", error);
        contractData = null;
    }
    return contractData;
}

export default function Index() {
    const data = useLoaderData();

    function ShowMetric () {
        const { data: contractData, isError, isLoading, status } = useContractRead({
            addressOrName: data.address,
            contractInterface: data.abi,
        }, 'getAllocationGroups',     {
            onError: (err) => {
              console.error(err);
            },
          })
        console.log('contracttoread', contractData, "isError", isError, "isLoading", isLoading, "status", status );
        return (
            <div className="tw-mx-auto">
                {Array.isArray(contractData) && contractData.map((accounts) => {
                    // eslint-disable-next-line react/jsx-key
                    return <p> {accounts[0]}</p>
                })}
            </div>
        )
    }

    function ClaimBody({isOpen, setIsOpen, selectWalletObj, children}: {isOpen?: boolean, selectWalletObj?: any, setIsOpen?: Dispatch<SetStateAction<boolean>>, children?: ReactElement}) {
        const { account } = selectWalletObj;


         return (
         <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
             <div className="tw-bg-white tw-rounded-full tw-w-[120px] tw-h-[120px] tw-flex tw-flex-col tw-justify-center tw-mx-auto">
             <img src="img/color-mark@2x.png" className="tw-mx-auto" alt="MetricsDAO" width="62" />
             </div>
             <h1 className="tw-text-5xl tw-mx-auto tw-pt-10 tw-pb-5 tw-font-bold">Vest Metric</h1>
             {account ? (
                 <ShowMetric />
             ) : (
             <ConnectWalletButton marginAuto buttonText="Connect Wallet to Vest" connectWallet={setIsOpen} />
             )
         }
         </section>
         )
     }

    return (
    <WalletProvider>
        <Wrapper contractJson={data} >
            <ClaimBody />
        </Wrapper>
    </WalletProvider>   
    )
}



