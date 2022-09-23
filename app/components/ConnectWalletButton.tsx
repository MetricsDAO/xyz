export default function ConnectWalletButton({
  buttonText,
  marginAuto,
  onClick,
}: {
  buttonText: string;
  onClick?: () => void;
  marginAuto?: boolean;
}) {
  return (
    <div className={`tw-flex tw-flex-wrap tw-flex-col  tw-text-sm ${marginAuto ? "tw-mx-auto" : "tw-ml-auto"}`}>
      <p className="tw-mb-2">Connect wallet to ask a question or vote</p>
      <button
        className={`tw-bg-[#21C5F2] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white tw-mx-auto tw-max-w-[175px] `}
        onClick={onClick}
      >
        <div className="tw-flex tw-items-center tw-justify-center"> {buttonText}</div>
      </button>
    </div>
  );
}
