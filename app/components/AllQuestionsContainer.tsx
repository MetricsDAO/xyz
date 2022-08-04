import { useEffect, useState } from "react";
import { useContractRead } from 'wagmi';
import { BigNumber, utils } from "ethers";
import { usePrevious } from '~/utils/helpers';

import AllQuestionsByState from "~/components/AllQuestionsByState";


export default function AllQuestionContainer ({
    address, 
    questionAPI, 
    xmetric, 
    questionStateController,
    bountyQuestion,
    }:{
    address: string, 
    questionAPI: Record<string, string>, 
    xmetric: Record<string, string>, 
    questionStateController: Record<string, string>,
    bountyQuestion: Record<string, string>
    }) {
    const [xmetricAmount, setxmetricAmount] = useState<string>("");

    const [latestTokenId, setLatestTokenId] = useState<number>(0);
    
    const prevAddress = usePrevious(address);

    const {data: balanceData} = useContractRead({
        addressOrName: xmetric.address,
        contractInterface: xmetric.abi,
    }, 'balanceOf', {
        args: [address],
        enabled: prevAddress !== address,
        onError: (err) => {
          console.error(err);
        },
    });

    const {data: currentQuestion} = useContractRead({
        addressOrName: bountyQuestion.address,
        contractInterface: bountyQuestion.abi,
    }, 'getMostRecentQuestion', {
        enabled: prevAddress !== address,
        onError: (err) => {
          console.error(err);
        },
    });

    useEffect(() => {
        if (BigNumber.isBigNumber(balanceData)) {
            console.log("metric Amount", utils.formatEther(balanceData.toString()));
            setxmetricAmount(utils.formatEther(balanceData.toString()));
        }
    }, [balanceData])

    useEffect(() => {
        if (BigNumber.isBigNumber(currentQuestion)) {
            console.log("latest question ID", currentQuestion.toNumber());
            setLatestTokenId(currentQuestion.toNumber());
        }
    }, [currentQuestion])

    return (
            <>
            <div className="tw-mx-auto bg-white tw-p-6 tw-rounded-lg tw-w-1/3 tw-mb-7">
                <p className="tw-text-center">{parseInt(xmetricAmount) > 0 ? (
                <span>You have {xmetricAmount} xMETRIC available to create or vote on questions</span>
                ) : (
                    <span>You currently don't have any xMETRIC to create or vote on questions.</span>
                )}
                </p>
            </div>
            <section className="tw-mx-auto tw-mb-7 tw-container tw-max-w-screen-xl">
              {latestTokenId && (
                <AllQuestionsByState 
                  questionAPI={questionAPI} 
                  latestQuestion={latestTokenId} 
                  questionStateController={questionStateController} 
                />
              )}
            </section>
            </>

    )
}