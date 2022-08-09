import type { Dispatch, SetStateAction } from "react";
export default function ConnectWalletButton({buttonText, connectWallet, marginAuto}: {buttonText:string, connectWallet?:Dispatch<SetStateAction<boolean>>, marginAuto?: boolean}) {
    return (
        <button className={`tw-bg-[#21C5F2] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white ${marginAuto ? 'tw-mx-auto' : 'tw-ml-auto' }`} onClick={() => {connectWallet && connectWallet(true)}}>
            <div className="tw-flex tw-items-center tw-justify-center"> {buttonText}</div>
        </button>
    )
}