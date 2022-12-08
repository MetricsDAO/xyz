import type { Token } from "@prisma/client";
import { Error, Field, TokenAvatar, ValidatedInput, ValidatedSelect } from "~/components";

function SelectLabel({ token }: { token: Token }) {
  return (
    <div className="flex gap-2 items-center min-w-[8rem]">
      <TokenAvatar size="lg" token={token} />
      <div>
        <p className="font-medium">{token.name}</p>
        <p className="text-stone-500 text-xs">{token.symbol}</p>
      </div>
    </div>
  );
}

export function AddPaymentAddressForm({ tokens }: { tokens: Token[] }) {
  return (
    <>
      <div className="flex items-center">
        <ValidatedSelect
          name="payment.tokenSymbol"
          options={tokens.map((t) => ({
            value: t.symbol,
            label: <SelectLabel token={t} />,
            selectedLabel: t.symbol,
          }))}
        />
        <ValidatedInput name="payment.address" placeholder="Select a chain and enter an address" />
      </div>
      <Error name="payment.address" />
    </>
  );
}
