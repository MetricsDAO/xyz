import { useEffect, useState } from "react";
import { useContractRead } from 'wagmi';
import { BigNumber } from "ethers";

import AllQuestionsByState from "~/components/AllQuestionsByState";


export default function AllQuestionContainer ({
    address, 
    questionAPI, 
    xmetric, 
    questionStateController,
    bountyQuestion,
    networkMatchesWallet
    }:{
    address?: string, 
    questionAPI: Record<string, string>, 
    xmetric?: Record<string, string>, 
    questionStateController: Record<string, string>,
    bountyQuestion: Record<string, string>,
    networkMatchesWallet: boolean
    }) {

    const [latestTokenId, setLatestTokenId] = useState<number>(0);
    

    const {data: currentQuestion} = useContractRead({
        addressOrName: bountyQuestion.address,
        contractInterface: bountyQuestion.abi,
    }, 'getMostRecentQuestion', {
        // enabled: prevAddress !== address,
        onError: (err) => {
          console.error(err);
        },
    });


    useEffect(() => {
        if (BigNumber.isBigNumber(currentQuestion)) {
            console.log("latest question ID", currentQuestion.toNumber());
            setLatestTokenId(currentQuestion.toNumber());
        }
    }, [currentQuestion])

    return (
            <>
            <section className="tw-mx-auto tw-mb-7 tw-container tw-max-w-screen-xl">
              {latestTokenId && (
                <AllQuestionsByState 
                  questionAPI={questionAPI} 
                  latestQuestion={latestTokenId} 
                  questionStateController={questionStateController}
                  networkMatchesWallet={networkMatchesWallet} 
                />
              )}
            </section>
            </>

    )
}