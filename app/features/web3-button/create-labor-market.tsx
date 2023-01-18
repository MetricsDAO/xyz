import { Button } from "~/components";
import type { LaborMarketContract } from "~/domain";
import { useCreateLaborMarket } from "~/hooks/use-create-labor-market";
import type { Web3Hook } from "./types";

export function CreateLaborMarketWeb3Button({ data, onWriteSuccess }: Web3Hook<LaborMarketContract>) {
  const { write } = useCreateLaborMarket({ data, onWriteSuccess });

  const onClick = () => {
    write?.();
  };

  return (
    <Button size="md" type="button" onClick={onClick}>
      Create
    </Button>
  );
}
