// import { useLoaderData } from "@remix-run/react";
import type { SetStateAction, Dispatch} from "react";

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import ConnectWalletButton from "~/components/ConnectWalletButton";
import AllQuestionsContainer from "~/components/AllQuestionsContainer";

import type { GetAccountResult, Provider } from "@wagmi/core";
 
// import {xMetricJson, questionAPIJson, questionStateController} from "~/services/contracts.server";
import xMetricJson from "core-evm-contracts/deployments/ropsten/Xmetric.json";
import questionAPIJson from "core-evm-contracts/deployments/ropsten/QuestionAPI.json";
import questionStateController from "core-evm-contracts/deployments/ropsten/QuestionStateController.json";

// export async function loader() {
//     return {
//         xMetricJson,
//         questionAPIJson,
//         questionStateController
//     }
// }

export default function Index() {
    // const {xMetricJson, questionAPIJson, questionStateController  } = useLoaderData();
    const xMETRICAbiAndAddress = {
        abi: xMetricJson.abi,
        address: xMetricJson.address,
    }

    const questionAPIAbiAndAddress = {
        abi: questionAPIJson.abi,
        address: questionAPIJson.address,
    }

    const questionStateControllerAbiandAddress = {
        abi: questionStateController.abi,
        address: questionStateController.address,
    }

        /* ELEMENT CLONED IN WRAPPER */
        function ClaimBody({setIsOpen, account}: {setIsOpen?: Dispatch<SetStateAction<boolean>>, account?: GetAccountResult<Provider> | undefined}) {
            return (
            <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
                <div className="tw-bg-white tw-rounded-full tw-w-[120px] tw-h-[120px] tw-flex tw-flex-col tw-justify-center tw-mx-auto">
                <img src="img/color-mark@2x.png" className="tw-mx-auto" alt="MetricsDAO" width="62" />
                </div>
                <h1 className="tw-text-5xl tw-mx-auto tw-pt-10 tw-pb-5 tw-font-bold">Question List</h1>
                {account?.address && account?.connector ? (
                    <AllQuestionsContainer address={account.address} questionAPI={questionAPIAbiAndAddress} questionStateController={questionStateControllerAbiandAddress} xmetric={xMETRICAbiAndAddress} />
                ) : (
                <ConnectWalletButton marginAuto buttonText="Connect Wallet to Ask Question" connectWallet={setIsOpen} />
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



