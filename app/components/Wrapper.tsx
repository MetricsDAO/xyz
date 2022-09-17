import { useLocation } from "@remix-run/react";
import type { ReactElement } from "react";
import { cloneElement, isValidElement } from "react";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { Buffer } from "buffer";
import Modal from "./Modal";
import RewardsHeader from "./RewardsHeader";

export default function Wrapper({ children, network }: { children?: ReactElement; network: string }) {
  let link: string;
  let linkText: string;
  
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain, chains } = useNetwork();
  
  const primaryChainObj = chains.filter(chainObj => {
    return chainObj.name.toLowerCase() === network
  })[0]

  const { switchNetwork } = useSwitchNetwork({ 
    chainId: primaryChainObj.id,
    onError() {
        tryRPCSwitchNetwork();
    }
  });

  async function tryRPCSwitchNetwork() {
    try {
      console.log("Trying RPC switch chain");
      await window?.ethereum?.request({
        method: 'wallet_switchEthereumChain', 
        params: [{ 
          chainId: primaryChainObj.id.toString(16),
        }]
      })
    }
    catch (error) {
      console.log("Error with RPC switch. Attempting to add chain with RPC.", error);
      // TODO: Some chains are not configured within Metamask and cannot switch without an RPC
      // wallet_addEthereumChain call. The switch chain RPC call works but this add chain
      // does not, despite being copy pasta'd from multiple documentations. This is mainly
      // reproduced when the primary chain is hardhat/localhost.
      // TODO: Linting issues?
      // try {
      //   await window?.ethereum?.request({
      //     method: 'wallet_addEthereumChain',
      //     params: [{
      //       chainId: primaryChainObj.id.toString(16),
      //       rpcUrls: [primaryChainObj.rpcUrls.default],
      //       chainName: primaryChainObj.name,
      //       nativeCurrency: primaryChainObj.nativeCurrency,
      //       blockExplorerUrls: [primaryChainObj.blockExplorers],
      //     }]
      //   });
      // }
      // catch (error) {
      //   console.log("Could not add chain", error)
      // }
    }
  }

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
