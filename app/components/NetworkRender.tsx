import { useNetwork, useSwitchNetwork } from "wagmi";
import { filteredNetwork } from "~/utils/helpers";

export default function NetworkRender() {
  const { chain } = useNetwork();
  // TODO: switch to other chains?
  const { switchNetwork } = useSwitchNetwork({ chainId: 137 });
  const chainName = chain?.name;

  // TODO: Probably don't need this if/else
  if (typeof switchNetwork === "function") {
    return (
      <div className={`tw-flex tw-flex-wrap tw-max-w-xs tw-text-sm tw-mx-auto`}>
        <p className="tw-mb-2"> You are currently connected to {chainName}</p>
        <button
          onClick={() => switchNetwork()}
          className="tw-bg-[#21C5F2] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white"
        >
          switch network
        </button>
      </div>
    );
  } else {
    return (
      <div className={`tw-flex tw-flex-wrap tw-max-w-xs tw-text-sm tw-mx-auto`}>
        <p className="tw-mb-2"> You are currently connected to {chainName}</p>
        <p>Please switch wallet to {filteredNetwork} network</p>
      </div>
    );
  }
}
