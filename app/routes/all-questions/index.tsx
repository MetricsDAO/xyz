import type { SetStateAction, Dispatch} from "react";
import { useLoaderData } from "@remix-run/react";
import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import AllQuestionsContainer from "~/components/AllQuestionsContainer";

import { getContracts } from "~/services/contracts.server"
 

export async function loader() {
    const {xMetricJson, questionAPIJson, questionStateController, bountyQuestionJson} = getContracts();
    return {
        xMetricJson,
        questionAPIJson,
        questionStateController,
        bountyQuestionJson,
        network: process.env.NETWORK
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
    function ClaimBody({setIsOpen, address, chainName}: {setIsOpen?: Dispatch<SetStateAction<boolean>>, address?: string | undefined, chainName?: string}) {
        console.log("chainName", chainName?.toLowerCase(), "network", network, chainName?.toLowerCase() === network);
        return (
        <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
            <div className="tw-bg-white tw-rounded-full tw-w-[120px] tw-h-[120px] tw-flex tw-flex-col tw-justify-center tw-mx-auto">
            <img src="img/color-mark@2x.png" className="tw-mx-auto" alt="MetricsDAO" width="62" />
            </div>
            <h1 className="tw-text-5xl tw-mx-auto tw-pt-10 tw-pb-5 tw-font-bold">Question List</h1>
            <AllQuestionsContainer 
                    // address={address} 
                    questionAPI={questionAPIAbiAndAddress} 
                    questionStateController={questionStateControllerAbiandAddress} 
                    // xmetric={xMETRICAbiAndAddress}
                    bountyQuestion={bountyQuestionAbiAndAddress}
                    networkMatchesWallet={chainName?.toLowerCase() === network} 
                    />
        </section>
        )
    }
    console.log("index all questions");

    return (
    <WalletProvider network={network}>
        <Wrapper network={network} >
        <ClaimBody /> 
        </Wrapper>
    </WalletProvider>   
    )
}



