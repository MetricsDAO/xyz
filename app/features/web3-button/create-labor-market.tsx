import { Button } from "~/components";
import type { LaborMarketContract } from "~/domain";
import { useCreateLaborMarket } from "~/hooks/use-create-labor-market";

export function CreateLaborMarketWeb3Button({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: LaborMarketContract;
  onTransactionSuccess?: () => void;
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
