import { Dispatch, SetStateAction } from "react";
import { Link } from "remix";
import ConnectWalletButton from "./ConnectWalletButton";
export default function RewardsHeader ({link, linkText, connectWallet, account, disconnect}: {link:string, linkText: string, connectWallet:Dispatch<SetStateAction<boolean>>, account: any, disconnect: any}) {
    return (
        <header className="tw-max-w-screen-xl tw-flex tw-mx-auto tw-my-7 tw-items-center">
                <Link
                    to="/"
                    className="tw-no-underline"
                >
                    <img
                        src="img/bw-lightbg@2x.png"
                        alt="MetricsDAO"
                        width="241"
                        height="44"
                        className="tw-mr-12"
                    />
                </Link>
                <Link
                    to={link}
                    className="tw-no-underline"
                >
                    <p>{linkText}</p>
                </Link>
                {account ? (
                    <div className="tw-ml-auto">
                    <button >{account.address} connected to {account.connector?.name}</button>
                    <button onClick={disconnect}>Disconnect</button>
                    </div>
                ) : (
                    <ConnectWalletButton buttonText="Connect Wallet" connectWallet={connectWallet} />
                )}
        </header>
    )
}