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
    let bountyQuestionJson;
    // TODO THIS IF F***ing STUPID FIX THIS
    // why can't I use template literals within require statement
    // vaultJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Vault.json`);

    // xMetricJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Xmetric.json`);
    // questionAPIJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/QuestionAPI.json`);
    // questionStateController = require(`core-evm-contracts/deployments/${process.env.NETWORK}/QuestionStateController.json`);
    // bountyQuestionJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/BountyQuestion.json`);
    console.log(process.env.NETWORK);
    try {
        if (process.env.NETWORK === "ropsten") {
        xMetricJson = require(`core-evm-contracts/deployments/ropsten/Xmetric.json`);
        questionAPIJson = require(`core-evm-contracts/deployments/ropsten/QuestionAPI.json`);
        questionStateController = require(`core-evm-contracts/deployments/ropsten/QuestionStateController.json`);
        bountyQuestionJson = require(`core-evm-contracts/deployments/ropsten/BountyQuestion.json`);
        } else if (process.env.NETWORK === "polygon") {
            xMetricJson = require(`core-evm-contracts/deployments/polygon/Xmetric.json`);
            questionAPIJson = require(`core-evm-contracts/deployments/polygon/QuestionAPI.json`);
            questionStateController = require(`core-evm-contracts/deployments/polygon/QuestionStateController.json`);
            bountyQuestionJson = require(`core-evm-contracts/deployments/polygon/BountyQuestion.json`);
        } else { //localhost
            xMetricJson = require(`core-evm-contracts/deployments/localhost/Xmetric.json`);
            questionAPIJson = require(`core-evm-contracts/deployments/localhost/QuestionAPI.json`);
            questionStateController = require(`core-evm-contracts/deployments/localhost/QuestionStateController.json`);
            bountyQuestionJson = require(`core-evm-contracts/deployments/localhost/BountyQuestion.json`);
        }
    } catch (error) {
        console.log("ERROR", error);
        xMetricJson = null;
        questionAPIJson = null;
        questionStateController = null;
        bountyQuestionJson = null;
    }
    return {
        xMetricJson,
        questionAPIJson,
        questionStateController,
        bountyQuestionJson,
        network: process.env.NETWORK,
    }
}

export default function Index() {
    const {xMetricJson, questionAPIJson, questionStateController, bountyQuestionJson, network  } = useLoaderData();
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

    const bountyQuestionAbiAndAddress = {
        abi: bountyQuestionJson.abi,
        address: bountyQuestionJson.address
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
                    <AllQuestionsContainer 
                        address={account.address} 
                        questionAPI={questionAPIAbiAndAddress} 
                        questionStateController={questionStateControllerAbiandAddress} 
                        xmetric={xMETRICAbiAndAddress}
                        bountyQuestion={bountyQuestionAbiAndAddress} 
                        />
                ) : (
                <ConnectWalletButton marginAuto buttonText="Connect Wallet to Ask Question" connectWallet={setIsOpen} />
                )
            }
            </section>
            )
        }


    return (
    <WalletProvider network={network}>
        <Wrapper >
        <ClaimBody /> 
        </Wrapper>
    </WalletProvider>   
    )
}



