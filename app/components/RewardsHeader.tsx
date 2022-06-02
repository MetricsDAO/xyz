import { Dispatch, SetStateAction } from "react";
import { Link } from "remix";
export default function RewardsHeader ({link, linkText, connectWallet}: {link:string, linkText: string, connectWallet:Dispatch<SetStateAction<boolean>>}) {
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
                <button className="tw-ml-auto tw-bg-[#21C5F2] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white" onClick={() => connectWallet(true)}><div className="flex items-center justify-center"> Connect Wallet</div></button>
        </header>
    )
}