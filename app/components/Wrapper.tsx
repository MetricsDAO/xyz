import { useLocation } from "@remix-run/react";
import type { ReactElement} from "react";
import { useEffect, useState, cloneElement, isValidElement } from "react";
import { useAccount, useDisconnect, useNetwork, useConnect } from 'wagmi';
import { Buffer } from "buffer";
import Modal from './Modal';
import RewardsHeader from "./RewardsHeader";

export default function Wrapper ({children, network}: {children?: ReactElement, network:string}) {
    let link:string;
    let linkText: string;


    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { data: account } = useAccount();
    const { disconnect } = useDisconnect();
    const {
        activeChain,
        chains,
        switchNetwork
      } = useNetwork();

      const {activeConnector} = useConnect();
    

    useEffect(() => {
        if (account?.address && isOpen) {
            setIsOpen(false);
        }
    }, [account?.address, isOpen])

    // TODO REFACTOR
    if (location.pathname === "/staking") {
        link =  "/claim";
        linkText = "Claim Metric"
    } else if (location.pathname === "/claim") {
        link = "/staking";
        linkText = "Stake Metric";
    } else if (location.pathname === "/question-generation") {
        link = "/all-questions"
        linkText = "View current questions"
    } else {
        link = "/question-generation";
        linkText = "Question Creation"
    }

    const chainName = activeChain?.name;
    const chainId = chains[0]?.id;
    const address = account?.address;
    const activeConnectorName = activeConnector?.name;


    if (!window.Buffer) {
        window.Buffer = Buffer;
    }


    if ((address && !activeConnector)) {
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
        {isValidElement(children) && cloneElement(children, {setIsOpen, address, chainName, chainId, switchNetwork})}
        </div>
    )
}
