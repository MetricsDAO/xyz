import { useLoaderData } from "@remix-run/react";
import { SetStateAction, Dispatch, useState } from "react";

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";

import CreateQuestionContainer from "~/components/CreateQuestionContainer";

import { getContracts } from "~/services/contracts.server";
import QuestionControls from "~/components/QuestionControls";
import { protocols, sortMethods } from "~/utils/helpers";
import SearchInput from "~/components/SearchInput";
import WritingTips from "~/components/WritingTips";

export async function loader() {
  const network = process.env.NETWORK || "localhost";
  const { xMetricJson, questionAPIJson, vaultJson, costController } = getContracts({ network: network });

  return {
    xMetricJson,
    questionAPIJson,
    vaultJson,
    costController,
    network: network,
  };
}

export default function Index() {
  const { xMetricJson, questionAPIJson, vaultJson, costController, network } = useLoaderData();

  const xMETRICAbiAndAddress = {
    abi: xMetricJson.abi,
    address: xMetricJson.address,
  };

  const [selected, setSelected] = useState(sortMethods[0].name);

  const [selectedProgram, setSelectedProgram] = useState(
    protocols.reduce((acc, protocol) => {
      acc[protocol.name] = false;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const questionAPIAbiAndAddress = {
    abi: questionAPIJson.abi,
    address: questionAPIJson.address,
  };

  const vaultAbiandAddress = {
    abi: vaultJson.abi,
    address: vaultJson.address,
  };

  const costControllerAbiandAddress = {
    abi: costController.abi,
    address: costController.address,
  };

  const contracts = {
    xmetric: xMETRICAbiAndAddress,
    questionAPI: questionAPIAbiAndAddress,
    vault: vaultAbiandAddress,
    costController: costControllerAbiandAddress,
  };

  /* ELEMENT CLONED IN WRAPPER */
  function ClaimBody({
    setIsOpen,
    address,
    chainId,
    switchNetwork,
    chainName,
  }: {
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
    address?: string;
    chainId?: number;
    switchNetwork?: (chainId?: number) => void;
    chainName?: string;
  }) {
    return (
      <div className="tw-flex tw-flex-row tw-justify-center">
        <div className="tw-block tw-border tw-basis-1/4">
          <QuestionControls
            setSelected={setSelected}
            selected={selected}
            setSelectedProgram={setSelectedProgram}
            selectedProgram={selectedProgram}
          />
        </div>
        <div className="tw-border tw-basis-1/2 tw-p-5">
          <SearchInput />
          <div className="tw-bg-[#FAFAFA] tw-p-6 tw-rounded-lg gap-2 tw-mt-6 tw-border">
            <CreateQuestionContainer address={address} />
          </div>
        </div>
        <div className="tw-border tw-basis-1/4 tw-p-2">
          <WritingTips />
        </div>
      </div>
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
