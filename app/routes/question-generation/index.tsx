import { useLoaderData } from "@remix-run/react";
import type { SetStateAction, Dispatch} from "react";

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import ConnectWalletButton from "~/components/ConnectWalletButton";
import CreateQuestionContainer from "~/components/CreateQuestionContainer";

import type { GetAccountResult, Provider } from "@wagmi/core";


export async function loader() {
    let xMetricJson;
    let questionAPIJson;
    let costController;
    let vaultJson;
    // TODO THIS is STUPID FIX THIS
    // why can't I use template literals within require statement
    // vaultJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Vault.json`);
    xMetricJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Xmetric.json`);
    questionAPIJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/QuestionAPI.json`);
    costController = require(`core-evm-contracts/deployments/${process.env.NETWORK}/ActionCostController.json`);
    vaultJson = require(`core-evm-contracts/deployments/${process.env.NETWORK}/Vault.json`);
    // try {
    //     if (process.env.NETWORK === "ropsten") {
    //     xMetricJson = require(`../../evm-contracts/deployments/ropsten/Xmetric.json`);
    //     questionAPIJson = require(`../../evm-contracts/deployments/ropsten/QuestionAPI.json`);
    //     costController = require(`../../evm-contracts/deployments/ropsten/ActionCostController.json`);
    //     vaultJson = require(`../../evm-contracts/deployments/ropsten/Vault.json`);
    //     } else if (process.env.NETWORK === "polygon") {
    //         xMetricJson = require(`../../evm-contractss/deployments/polygon/Xmetric.json`);
    //         questionAPIJson = require(`../../evm-contracts/deployments/polygon/QuestionAPI.json`);
    //         costController = require(`../../evm-contracts/deployments/polygon/ActionCostController.json`);
    //         vaultJson = require(`../../evm-contracts/deployments/polygon/Vault.json`);
    //     } else { //localhost
    //         xMetricJson = require(`../../evm-contracts/deployments/localhost/Xmetric.json`);
    //         questionAPIJson = require(`../../evm-contracts/deployments/localhost/QuestionAPI.json`);
    //         costController = require(`../../evm-contracts/deployments/localhost/ActionCostController.json`);
    //         vaultJson = require(`../../evm-contracts/deployments/localhost/Vault.json`);
    //     }
    // } catch (error) {
    //     console.log("ERROR", error);
    //     xMetricJson = null;
    //     questionAPIJson = null;
    //     vaultJson = null;
    //     costController = null;
    // }
    return {
        xMetricJson,
        questionAPIJson,
        vaultJson,
        costController,
        network: process.env.NETWORK
    }
}

export default function Index() {
    const {xMetricJson, questionAPIJson, vaultJson, costController, network  } = useLoaderData();
    const xMETRICAbiAndAddress = {
        abi: xMetricJson.abi,
        address: xMetricJson.address,
    }

    const questionAPIAbiAndAddress = {
        abi: questionAPIJson.abi,
        address: questionAPIJson.address,
    }

    const vaultAbiandAddress = {
        abi: vaultJson.abi,
        address: vaultJson.address,
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
                    <CreateQuestionContainer address={account.address} questionAPI={questionAPIAbiAndAddress} vault={vaultAbiandAddress} costController={costControllerAbiandAddress} xmetric={xMETRICAbiAndAddress} />
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



