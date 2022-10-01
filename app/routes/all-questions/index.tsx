import { useLoaderData } from "@remix-run/react";
import AllQuestionsContainer from "~/components/AllQuestionsContainer";
import ContractContextWrapper from "~/components/ContractContextWrapper";
import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import { getContracts } from "~/services/contracts.server";

export async function loader() {
  const network = process.env.NETWORK || "localhost";
  const contractData = getContracts({ network: network });

  const bountyQuestionJson = {
    abi: contractData.bountyQuestionJson.abi,
    address: contractData.bountyQuestionJson.address,
  };

  const questionAPIJson = {
    abi: contractData.questionAPIJson.abi,
    address: contractData.questionAPIJson.address,
  };

  const questionStateController = {
    abi: contractData.questionStateController.abi,
    address: contractData.questionStateController.address,
  };

  return {
    bountyQuestionJson,
    questionAPIJson,
    questionStateController,
    network: network,
  };
}

export default function Index() {
  const { network, bountyQuestionJson, questionAPIJson, questionStateController } = useLoaderData();

  const contracts = {
    bountyQuestion: bountyQuestionJson,
    questionAPI: questionAPIJson,
    questionStateController: questionStateController,
  };

  return (
    <WalletProvider network={network}>
      <ContractContextWrapper network={network} contracts={contracts}>
        <>
          <Wrapper network={network} />
          <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
            <AllQuestionsContainer />
          </section>
        </>
      </ContractContextWrapper>
    </WalletProvider>
  );
}
