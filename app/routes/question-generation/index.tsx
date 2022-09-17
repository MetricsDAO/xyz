import { useLoaderData } from "@remix-run/react";
import type { SetStateAction, Dispatch } from "react";

import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";
import ConnectWalletButton from "~/components/ConnectWalletButton";
import CreateQuestionContainer from "~/components/CreateQuestionContainer";

import { getContracts } from "~/services/contracts.server";

import NetworkRender from "~/components/NetworkRender";

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
    address?: string;
    chainId?: number;
    switchNetwork?: (chainId?: number) => void;
    chainName?: string;
  }) {
    return (
      <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
        <div className="tw-bg-white tw-rounded-full tw-w-[120px] tw-h-[120px] tw-flex tw-flex-col tw-justify-center tw-mx-auto">
          <img src="img/color-mark@2x.png" className="tw-mx-auto" alt="MetricsDAO" width="62" />
        </div>
        <h1 className="tw-text-5xl tw-mx-auto tw-pt-10 tw-pb-5 tw-font-bold">Question Generation</h1>
        {address ? (
          <NetworkRender network={network} chainName={chainName} chainId={chainId} switchNetwork={switchNetwork}>
            <CreateQuestionContainer
              address={address}
              questionAPI={questionAPIAbiAndAddress}
              vault={vaultAbiandAddress}
              costController={costControllerAbiandAddress}
              xmetric={xMETRICAbiAndAddress}
              network={network}
            />
          </NetworkRender>
        ) : (
          // <ConnectWalletButton marginAuto buttonText="Connect Wallet" connectWallet={setIsOpen} />
          // TODO: I currently cannot think of a great way to include the connection Modal when all the state vars needed
          // are inside of the wrapper component. We cannot access wagmi hooks without being inside of 
          // WalletProvider either, so a different heirarchy is needed. My current solution is to put WalletProvider 
          // and Wrapper outside of the Router. Any comment or alternative to this is welcomed.
          <h1 className="tw-text-center">Connect your wallet to create a question.</h1>
        )}
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
