import type { SetStateAction, Dispatch } from "react";
import { useLoaderData } from "@remix-run/react";
import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import { filteredNetwork } from "~/utils/helpers";

import { getContracts } from "~/services/contracts.server";
import { withServices } from "~/services/with-services";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import AllQuestionsContainer from "~/components/AllQuestionsContainer";

export const loader = async (data: DataFunctionArgs) => {
  return withServices(data, async ({ bountyQuestion }) => {
    const currentQuestion = await bountyQuestion.getCurrentQuestion();
    const { questionAPIJson, questionStateControllerJson, bountyQuestionJson } = getContracts();
    return {
      questionAPIJson,
      questionStateController: questionStateControllerJson,
      bountyQuestionJson,
      network: process.env.NETWORK ?? "localhost",
      currentQuestion,
    };
  });
};

export default function Index() {
  const {
    // xMetricJson,
    questionAPIJson,
    questionStateController,
    bountyQuestionJson,
    network,
    currentQuestion,
  } = useLoaderData<ReturnType<typeof loader>>();

  // const xMETRICAbiAndAddress = {
  //   abi: xMetricJson.abi,
  //   address: xMetricJson.address,
  // };

  const questionAPIAbiAndAddress = {
    abi: questionAPIJson.abi,
    address: questionAPIJson.address,
  };

  const questionStateControllerAbiandAddress = {
    abi: questionStateController.abi,
    address: questionStateController.address,
  };

  const bountyQuestionAbiAndAddress = {
    abi: bountyQuestionJson.abi,
    address: bountyQuestionJson.address,
  };

  /* ELEMENT CLONED IN WRAPPER */
  function ClaimBody({
    setIsOpen,
    address,
    chainName,
  }: {
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
    address?: string | undefined;
    chainName?: string;
  }) {
    // console.log("chainName", chainName?.toLowerCase(), "network", network, chainName?.toLowerCase() === network);
    return (
      <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
        <AllQuestionsContainer
          // address={address}
          questionAPI={questionAPIAbiAndAddress}
          questionStateController={questionStateControllerAbiandAddress}
          // xmetric={xMETRICAbiAndAddress}
          bountyQuestion={bountyQuestionAbiAndAddress}
          networkMatchesWallet={chainName?.toLowerCase() === filteredNetwork(network)}
          currentQuestion={currentQuestion}
        />
      </section>
    );
  }

  return (
    <WalletProvider network={network}>
      <Wrapper network={network}>
        <ClaimBody />
      </Wrapper>
    </WalletProvider>
  );
}
