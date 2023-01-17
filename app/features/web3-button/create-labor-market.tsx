import { Button } from "~/components";
import type { LaborMarketContract, Web3Hook } from "~/domain";
import { useCreateLaborMarket } from "~/hooks/use-create-labor-market";

export function CreateLaborMarketWeb3Button(props: Web3Hook<LaborMarketContract>) {
  const { write } = useCreateLaborMarket(props);

  const onClick = () => {
    write?.();
  };

  return (
    <Button size="md" type="button" onClick={onClick}>
      Create
    </Button>
  );
}
