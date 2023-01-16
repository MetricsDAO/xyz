import { Button } from "~/components";
import type { LaborMarketContract } from "~/domain";
import { useCreateLaborMarket } from "~/hooks/use-create-labor-market";
import type { TransactionReceipt } from "@ethersproject/abstract-provider";

export function CreateLaborMarketWeb3Button({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: LaborMarketContract;
  onTransactionSuccess?: (receipt: TransactionReceipt) => void;
  onWriteSuccess?: (hash: `0x${string}`) => void;
}) {
  const { write } = useCreateLaborMarket({
    data,
    onTransactionSuccess,
    onWriteSuccess,
  });

  const onCreate = () => {
    write?.();
  };

  return (
    <Button size="md" type="button" onClick={onCreate}>
      Create
    </Button>
  );
}
