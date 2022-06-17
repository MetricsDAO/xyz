import { useLocation } from "remix";
import type { ReactElement} from "react";
import { useEffect, useState, cloneElement, isValidElement } from "react";
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { Buffer } from "buffer";
import Modal from './Modal';
import RewardsHeader from "./RewardsHeader";

export default function Wrapper ({children}: {children?: ReactElement}) {
    let link:string;
    let linkText: string;


    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { data: account } = useAccount()
    const { connect, connectors, error, isConnecting, pendingConnector } =
      useConnect()
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (account) {
            setIsOpen(false);
        }
    }, [account])

    if (location.pathname === "/staking") {
        link =  "/claim";
        linkText = "Claim Metric"
    } else {
        link = "/staking";
        linkText = "Stake Metric";
    }


    if (!window.Buffer) {
        window.Buffer = Buffer;
      }

    const selectWalletObj = {
        connectors,
        connect,
        error,
        isConnecting,
        pendingConnector,
        account
    }

    return (
        <div>
        <RewardsHeader link={link} linkText={linkText} connectWallet={setIsOpen} account={account} disconnect={disconnect}/>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} selectWalletObj={selectWalletObj} />
        {isValidElement(children) && cloneElement(children, {isOpen, setIsOpen, selectWalletObj, account })}
        </div>
    )
}
