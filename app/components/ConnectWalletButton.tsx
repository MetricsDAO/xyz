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
    <div className={`tw-flex tw-flex-wrap tw-flex-col  tw-text-sm ${marginAuto ? "tw-mx-auto" : "tw-ml-auto"}`}>
      <button
        className={`tw-bg-white tw-px-5 tw-py-3 tw-max-w-sm tw-text-sm tw-rounded-lg tw-text-[#626262] tw-mx-auto border-gradient`}
        onClick={() => {
          connectWallet && connectWallet(true);
        }}
      >
        <div className="tw-flex tw-items-center tw-justify-center"> {buttonText}</div>
      </button>
    </div>
  );
}
