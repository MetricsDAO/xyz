import type { SetStateAction, Dispatch} from "react";
import { useLoaderData } from "@remix-run/react";
import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import ConnectWalletButton from "~/components/ConnectWalletButton";
import AllQuestionsContainer from "~/components/AllQuestionsContainer";

import type { GetAccountResult, Provider } from "@wagmi/core";
 

export async function loader() {
    let xMetricJson;
    let questionAPIJson;
    let questionStateController;
    // TODO THIS IF F***ing STUPID FIX THIS
    // why can't I use template literals within require statement
    // vaultJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Vault.json`);
    try {
        if (process.env.NETWORK === "ropsten") {
        xMetricJson = require(`../../evm-contracts/deployments/ropsten/Xmetric.json`);
        questionAPIJson = require(`../../evm-contracts/deployments/ropsten/QuestionAPI.json`);
        questionStateController = require(`../../evm-contracts/deployments/ropsten/QuestionStateController.json`);
        } else if (process.env.NETWORK === "polygon") {
            xMetricJson = require(`../../evm-contracts/deployments/polygon/Xmetric.json`);
            questionAPIJson = require(`../../evm-contracts/deployments/polygon/QuestionAPI.json`);
            questionStateController = require(`../../evm-contracts/deployments/polygon/QuestionStateController.json`);
        } else {
            xMetricJson = require(`../../evm-contracts/deployments/localhost/Xmetric.json`);
            questionAPIJson = require(`../../evm-contracts/deployments/localhost/QuestionAPI.json`);
            questionStateController = require(`../../evm-contracts/deployments/localhost/QuestionStateController.json`);
        }
    } catch (error) {
        console.log("ERROR", error);
        xMetricJson = null;
        questionAPIJson = null;
        questionStateController = null;
    }
    return {
        xMetricJson,
        questionAPIJson,
        questionStateController
    }
}

export default function Index() {
    const {xMetricJson, questionAPIJson, questionStateController  } = useLoaderData();
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



