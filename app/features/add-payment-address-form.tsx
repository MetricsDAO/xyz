import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import type { Network } from "@prisma/client";
import { useField } from "remix-validated-form";
import { Error, ValidatedInput, ValidatedSelect } from "~/components";
import { NetworkAvatar } from "~/components/avatar/network-avatar";
import { DEFAULT_SYMBOL } from "~/utils/helpers";

function SelectLabel({ network }: { network: Network }) {
  return (
    <div className="flex gap-2 items-center min-w-[8rem]">
      <NetworkAvatar size="lg" network={network} />
      <div>
        <p className="font-medium">{network.name}</p>
        <p className="text-stone-500 text-xs">{DEFAULT_SYMBOL[network.name] ?? network.name}</p>
      </div>
    </div>
  );
}

export function AddPaymentAddressForm({ networks }: { networks: Network[] }) {
  const { error: addressError, touched: addressTouched } = useField("payment.address");
  const { error: networkNameError, touched: networkNameTouched } = useField("payment.networkName");
  const untouched = !addressTouched && !networkNameTouched;
  return (
    <>
      <div className="flex items-center">
        <ValidatedSelect
          name="payment.networkName"
          options={networks.map((n) => ({
            value: n.name,
            label: <SelectLabel network={n} />,
            selectedLabel: (
              <div className="flex gap-2 items-center">
                <NetworkAvatar size="md" network={n} />
                <p>{n.name}</p>
              </div>
            ),
          }))}
        />
        <ValidatedInput
          iconLeft={
            untouched ? null : addressError || networkNameError ? (
              <XCircleIcon className="mr-1 text-rose-500 h-5 w-5" />
            ) : (
              <CheckCircleIcon className="mr-1 text-lime-500 h-5 w-5" />
            )
          }
          name="payment.address"
          placeholder="Select a chain and enter an address"
        />
      </div>
      <Error name="payment.address" />
      <Error name="payment.networkName" />
    </>
  );
}
