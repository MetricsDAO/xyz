import { useEffect, useState } from "react";
import { useContractRead, useNetwork } from "wagmi";
import { BigNumber } from "ethers";

import AllQuestionsByState from "~/components/AllQuestionsByState";
import { useContracts } from "~/hooks/useContracts";
import { desiredChainId } from "~/utils/helpers"

export default function AllQuestionContainer({network}: {network: string}) {
  const [latestTokenId, setLatestTokenId] = useState<number>(0);
  const chainId = desiredChainId(network);
  const { bountyQuestionJson, questionAPIJson, questionStateController } = useContracts({ chainId: chainId });

  const questionAPIAbiAndAddress = {
    abi: questionAPIJson?.abi,
    address: questionAPIJson?.address,
  };

  const questionStateControllerAbiandAddress = {
    abi: questionStateController?.abi,
    address: questionStateController?.address,
  };

  const bountyQuestionAbiAndAddress = {
    abi: bountyQuestionJson?.abi,
    address: bountyQuestionJson?.address,
  };

  const { data: currentQuestion } = useContractRead({
    addressOrName: bountyQuestionAbiAndAddress?.address,
    contractInterface: bountyQuestionAbiAndAddress?.abi,
    functionName: "getMostRecentQuestion",
    onError(err) {
      console.error(err);
    },
  });

  useEffect(() => {
    if (BigNumber.isBigNumber(currentQuestion)) {
      // console.log("latest question ID", currentQuestion.toNumber());
      setLatestTokenId(currentQuestion.toNumber());
    }
  }, [currentQuestion]);

  // TODO
  if (!bountyQuestionJson) {
    return <>Chain not supported yet</>;
  }

  return (
    <>
      <section className="tw-mx-auto tw-mb-7 tw-container">
        {latestTokenId && (
          <AllQuestionsByState
            questionAPI={questionAPIAbiAndAddress}
            latestQuestion={latestTokenId}
            questionStateController={questionStateControllerAbiandAddress}
            networkMatchesWallet={false}
          />
        )}
      </section>
    </>
  );
}
