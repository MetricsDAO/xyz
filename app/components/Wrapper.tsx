import { useLocation } from "@remix-run/react";
import type { ReactElement } from "react";
import { cloneElement, isValidElement } from "react";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { Buffer } from "buffer";
import { desiredChainId } from "~/utils/helpers";
import Modal from "./Modal";
import RewardsHeader from "./RewardsHeader";

export default function Wrapper({ children, network }: { children?: ReactElement; network: string }) {
  let link: string;
  let linkText: string;
  
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const { switchNetwork } = useSwitchNetwork({ 
    chainId: desiredChainId(network),
    onError(error) {
      console.log("Network switch error", error)
      if (error.toString() == "AddChainError: Error adding chain") {
        console.log("Trying to add network to wallet...");
        // TODO: Some chains are not configured within Metamask and cannot switch without an RPC
        //       wallet_addEthereumChain call. The code below half works, but only for Metamask.
        //       There has got to be a better solution, however it is not completely necessary as
        //       the only chain I've noticed an issue with is hardhat/localhost.
        // try {
        //    window?.ethereum?.request({
        //     method: 'wallet_addEthereumChain',
        //     params: [{
        //       chainId: BigNumber.from(desiredChain.id).toHexString(),
        //       rpcUrls: [desiredChain.rpcUrls.default]
        //     }]
        //   });
        // }
        // catch(error) {
        //   console.log("error adding chain", error);
        // }
      }
    }
  });

  useEffect(() => {
    if (address && isOpen) {
      setIsOpen(false);
    }
  }, [address, isOpen]);

  // TODO REFACTOR
  if (location.pathname === "/staking") {
    link = "/claim";
    linkText = "Claim Metric";
  } else if (location.pathname === "/claim") {
    link = "/staking";
    linkText = "Stake Metric";
  } else if (location.pathname === "/question-generation") {
    link = "/all-questions";
    linkText = "View current questions";
  } else {
    link = "/question-generation";
    linkText = "Question Creation";
  }

  const chainName = chain?.name;
  const chainId = chain?.id;
  const activeConnectorName = connector?.name;

  if (!window.Buffer) {
    window.Buffer = Buffer;
  }

  if (address && !connector) {
    return null;
  }

  return (
    <div>
      <RewardsHeader
        link={link}
        network={network}
        linkText={linkText}
        connectWallet={setIsOpen}
        address={address}
        disconnect={disconnect}
        chainName={chainName}
        chainId={chainId}
        switchNetwork={switchNetwork}
        activeConnector={activeConnectorName}
      />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} selectWallet={true} />
      {isValidElement(children) && cloneElement(children, { setIsOpen, address, chainName, chainId, switchNetwork })}
    </div>
  );
}
