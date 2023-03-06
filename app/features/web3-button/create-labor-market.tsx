import { Button } from "~/components";
import type { LaborMarketContract } from "~/domain";
import { useCreateLaborMarket } from "~/hooks/use-create-labor-market";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function CreateLaborMarketWeb3Button(props: Web3Hook<LaborMarketContract>) {
  const { write } = useCreateLaborMarket(props);

  const onClick = () => {
    write?.();
  };

  return (
    <ConnectWalletWrapper onClick={onClick}>
      <Button size="md" type="button">
        Create
      </Button>
    </ConnectWalletWrapper>
  );
}
