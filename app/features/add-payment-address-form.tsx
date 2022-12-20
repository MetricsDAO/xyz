import type { Network } from "@prisma/client";
import { Error, ValidatedInput, ValidatedSelect } from "~/components";

function SelectLabel({ network }: { network: Network }) {
  return (
    <div className="flex gap-2 items-center min-w-[8rem]">
      {/* TODO NetworkAvatar */}
      {/* <TokenAvatar size="lg" token={token} /> */}
      <div>
        <p className="font-medium">{network.name}</p>
        {/* TODO symbol */}
        <p className="text-stone-500 text-xs">{network.name}</p>
      </div>
    </div>
  );
}

export function AddPaymentAddressForm({ networks }: { networks: Network[] }) {
  return (
    <>
      <div className="flex items-center">
        <ValidatedSelect
          name="payment.networkName"
          options={networks.map((n) => ({
            value: n.name, // TODO: use symbol
            label: <SelectLabel network={n} />,
            selectedLabel: n.name, // TODO: use symbol
          }))}
        />
        <ValidatedInput name="payment.address" placeholder="Select a chain and enter an address" />
      </div>
      <Error name="payment.address" />
      <Error name="payment.networkName" />
    </>
  );
}
