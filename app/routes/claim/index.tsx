import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { SetStateAction, Dispatch} from "react";

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import ConnectWalletButton from "~/components/ConnectWalletButton";
import ShowUser from "~/components/ShowUser";

import type { GetAccountResult, Provider } from "@wagmi/core";


export async function loader() {
    // REMOVE THIS LATER
    return redirect("/");
    // let topChefJson;
    // let metricJson;
    // const network = "localhost";
    // try {
    //     topChefJson = require(`core-evm-contracts/deployments/${network}/TopChef.json`);
    //     metricJson = require(`core-evm-contracts/deployments/${network}/MetricToken.json`);
    // } catch (error) {
    //     console.log("ERROR", error);
    //     topChefJson = null;
    //     metricJson = null;
    // }
    // return {
    //     topChefJson,
    //     metricJson
    // }
}

export default function Index() {
    const {topChefJson } = useLoaderData();
    const topChefAbiAndAddress = {
        abi: topChefJson.abi,
        address: topChefJson.address,
    }

    /* ELEMENT CLONED IN WRAPPER */
    function ClaimBody({setIsOpen, account}: {setIsOpen?: Dispatch<SetStateAction<boolean>>, account?: GetAccountResult<Provider> | undefined}) {
         return (
         <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
             <div className="tw-bg-white tw-rounded-full tw-w-[120px] tw-h-[120px] tw-flex tw-flex-col tw-justify-center tw-mx-auto">
             <img src="img/color-mark@2x.png" className="tw-mx-auto" alt="MetricsDAO" width="62" />
             </div>
             <h1 className="tw-text-5xl tw-mx-auto tw-pt-10 tw-pb-5 tw-font-bold">Vest Metric</h1>
             {account?.address && account?.connector ? (
                 <ShowUser address={account.address} topChef={topChefAbiAndAddress} />
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



