import { useLoaderData } from "@remix-run/react";
import { SetStateAction, Dispatch, useState } from "react";

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";

import CreateQuestionContainer from "~/components/CreateQuestionContainer";

import { getContracts } from "~/services/contracts.server";
import QuestionControls from "~/components/QuestionControls";
import { protocols, sortMethods } from "~/utils/helpers";
import SearchInput from "~/components/SearchInput";

export async function loader() {
  const { xMetricJson, questionAPIJson, vaultJson, costController } = getContracts();
  return {
    xMetricJson,
    questionAPIJson,
    vaultJson,
    costController,
    network: process.env.NETWORK,
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

  /* ELEMENT CLONED IN WRAPPER */
  function ClaimBody({
    setIsOpen,
    address,
    chainId,
    switchNetwork,
    chainName,
  }: {
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
    address?: string | undefined;
    chainId?: number;
    switchNetwork?: (chainId?: number) => void;
    chainName?: string;
  }) {
    return (
      <div className="tw-flex tw-px-4 tw-flex-row justify-center tw-space-x-4">
        <div className="tw-block tw-border tw-p-2">
          <QuestionControls
            setSelected={setSelected}
            selected={selected}
            setSelectedProgram={setSelectedProgram}
            selectedProgram={selectedProgram}
          />
        </div>
        <div className="tw-basis-1/2">
          <SearchInput />
          <div className="tw-bg-[#FAFAFA] tw-p-6 tw-rounded-lg gap-2 tw-mt-3 tw-border">
            <CreateQuestionContainer
              address={address}
              questionAPI={questionAPIAbiAndAddress}
              vault={vaultAbiandAddress}
              costController={costControllerAbiandAddress}
              xmetric={xMETRICAbiAndAddress}
              network={network}
              chainId={chainId}
              switchNetwork={switchNetwork}
              chainName={chainName}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
        <div className="tw-border tw-basis-1/4 tw-p-2">
          <button disabled={true} className="tw-p-2">
            {" "}
            + Create question{" "}
          </button>
          <h4 className="tw-font-bold tw-text-xl tw-p-2">Bounty question writing tips</h4>
          <div className="tw-p-5">
            <p className="tw-font-bold">Be specific</p>
            <p className="tw-text-sm tw-mb-4 tw-text-[#637381]">tips</p>
          </div>
          <div className="tw-p-5">
            <p className="tw-font-bold">Examples of good writing</p>
            <p className="tw-text-sm tw-mb-4 tw-text-[#637381]">examples</p>
          </div>
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
