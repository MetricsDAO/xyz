import type { Dispatch, SetStateAction } from "react";
export default function ConnectWalletButton({
  buttonText,
  connectWallet,
  marginAuto,
}: {
  buttonText: string;
  connectWallet?: Dispatch<SetStateAction<boolean>>;
  marginAuto?: boolean;
}) {
  return (
    <button
      className={`tw-bg-white tw-border tw-px-5 tw-py-3 tw-max-w-xs tw-text-sm tw-rounded-lg tw-text-[#626262] `}
      onClick={() => {
        connectWallet && connectWallet(true);
      }}
    >
      <div className="tw-flex tw-items-center tw-justify-center"> {buttonText}</div>
    </button>
  );
}
