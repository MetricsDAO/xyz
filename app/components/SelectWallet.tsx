export default function SelectWallet ({selectWalletObj }: {selectWalletObj: any}) {
  const {connect, connectors, error, isConnecting, pendingConnector} = selectWalletObj;

  return (
    <div className="tw-flex tw-flex-col">
      {connectors.map((connector: any) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
          className="tw-p-5 tw-mb-4 tw-border tw-rounded-lg tw-border-gray-300"
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isConnecting &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  )
}