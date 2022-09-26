import { useEffect, useState, useContext } from "react";
import { useContractRead, useNetwork } from "wagmi";
import { BigNumber } from "ethers";

import AllQuestionsByState from "~/components/AllQuestionsByState";
import type { ContractContextType } from "~/components/ContractContextWrapper";
import { ContractContext } from "~/components/ContractContextWrapper"
import { desiredChainId } from "~/utils/helpers"

export default function AllQuestionContainer() {
  const { contracts, network }: ContractContextType = useContext(ContractContext);
  const [latestTokenId, setLatestTokenId] = useState<number>(0);
  const { chain } = useNetwork();
  const primaryChainId = desiredChainId(network);
  const networkMatchesWallet = primaryChainId === chain?.id;

  const { data: currentQuestion } = useContractRead({
    addressOrName: contracts.bountyQuestion.address,
    contractInterface: contracts.bountyQuestion.abi,
    functionName: "getMostRecentQuestion",
    chainId: primaryChainId,
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

  return (
    <>
      <section className="tw-mx-auto tw-mb-7 tw-container">
        {latestTokenId && (
          <AllQuestionsByState
            questionAPI={contracts.questionAPI}
            latestQuestion={latestTokenId}
            questionStateController={contracts.questionStateController}
            networkMatchesWallet={networkMatchesWallet}
            chainId={primaryChainId}
          />
        )}
      </section>
    </>
  );
}
