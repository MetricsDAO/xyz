import { useLoaderData } from "@remix-run/react";
import type { SetStateAction, Dispatch} from "react";

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import ConnectWalletButton from "~/components/ConnectWalletButton";
import QuestionContainer from "~/components/QuestionContainer";

import type { GetAccountResult, Provider } from "@wagmi/core";


export async function loader() {
    let xMetricJson;
    let questionAPIJson;
    let costController;
    const network = "localhost";
    try {
        xMetricJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Xmetric.json`);
        questionAPIJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/QuestionAPI.json`);
        costController = require(`core-evm-contracts/deployments/${process.env.NETWORK}/ActionCostController.json`);
    } catch (error) {
        console.log("ERROR", error);
        xMetricJson = null;
        questionAPIJson = null;
        costController = null;
    }
    return {
        xMetricJson,
        questionAPIJson,
        costController
    }
}

export default function Index() {
    const {xMetricJson, questionAPIJson, costController  } = useLoaderData();
    const xMETRICAbiAndAddress = {
        abi: xMetricJson.abi,
        address: xMetricJson.address,
    }

    const questionAPIAbiAndAddress = {
        abi: questionAPIJson.abi,
        address: questionAPIJson.address,
    }

    const costControllerAbiandAddress = {
        abi: costController.abi,
        address: costController.address,
    }

        /* ELEMENT CLONED IN WRAPPER */
        function ClaimBody({setIsOpen, account}: {setIsOpen?: Dispatch<SetStateAction<boolean>>, account?: GetAccountResult<Provider> | undefined}) {
            return (
            <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
                <div className="tw-bg-white tw-rounded-full tw-w-[120px] tw-h-[120px] tw-flex tw-flex-col tw-justify-center tw-mx-auto">
                <img src="img/color-mark@2x.png" className="tw-mx-auto" alt="MetricsDAO" width="62" />
                </div>
                <h1 className="tw-text-5xl tw-mx-auto tw-pt-10 tw-pb-5 tw-font-bold">Question Generation</h1>
                {account?.address && account?.connector ? (
                    <QuestionContainer address={account.address} questionAPI={questionAPIAbiAndAddress} costController={costControllerAbiandAddress} xmetric={xMETRICAbiAndAddress} />
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



