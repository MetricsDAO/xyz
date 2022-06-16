import { getIcon } from "~/utils/helpers";
import { ChevronRight16 } from "@carbon/icons-react";
export default function SelectWallet ({selectWalletObj }: {selectWalletObj: any}) {
  const {connect, connectors, error, isConnecting, pendingConnector} = selectWalletObj;

  return (
    <div className="tw-flex tw-flex-col">
      {connectors.map((connector: any) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
          className="tw-p-5 tw-mb-4 tw-border tw-rounded-lg tw-border-gray-300 tw-flex tw-items-center"
        >
          <img  width="30" className="tw-mr-4" height="30" src={getIcon(connector.name)} alt="wallet logo" />
          <span>{connector.name === "Injected" ? "Browser Wallet" : connector.name }
           {!connector.ready && ' (unsupported)'}
           {isConnecting &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
            </span>
          <ChevronRight16 className="tw-ml-auto" />

        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  )
}