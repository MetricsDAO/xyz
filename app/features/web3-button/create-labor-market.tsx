import { useNetwork } from "wagmi";
import { Button } from "~/components";
import type { LaborMarketContract } from "~/domain";
import { useCreateLaborMarket } from "~/hooks/use-create-labor-market";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function CreateLaborMarketWeb3Button({ data, onWriteSuccess }: Web3Hook<LaborMarketContract>) {
  const { write } = useCreateLaborMarket({ data, onWriteSuccess });
  const { chain } = useNetwork();

  const onClick = () => {
    if (chain?.name !== "Ethereum") {
      write?.();
    }
  };

  return (
    <ConnectWalletWrapper>
      <Button asChild size="md" type="button" onClick={onClick}>
        <span> Create </span>
      </Button>
    </ConnectWalletWrapper>
  );
}
