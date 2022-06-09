import { useLocation } from "remix";
import { ReactElement, useEffect, useState, cloneElement, isValidElement } from "react";
import { useConnect, useContract, useAccount, useDisconnect } from 'wagmi';
import { Buffer } from "buffer";
import Modal from './Modal';
import RewardsHeader from "./RewardsHeader";

export default function Wrapper ({contractJson, children}: {contractJson: any, children?: ReactElement}) {
    let topChefContract: { abi: any; address: string };
    let link:string;
    let linkText: string;

    topChefContract = contractJson;

    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { data: account } = useAccount()
    const { connect, activeConnector, connectors, error, isConnecting, pendingConnector } =
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


    const contract = useContract({
        addressOrName: topChefContract.address,
        contractInterface: topChefContract.abi,
      });
      console.log('account', account, "contract", contract, "activeConnector", activeConnector);

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


    // const [selectedConnector, setSelectedConnector] =
    // useState<Connector<any, any>>();
        // useEffect(() => {
    //     if (activeConnector) {
    //       setSelectedConnector(activeConnector);
    //     }
    //   }, [activeConnector]);