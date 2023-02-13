import { useNetwork } from "wagmi";
import { Button } from "~/components";
import type { ServiceRequestContract } from "~/domain";
import { useCreateServiceRequest } from "~/hooks/use-create-service-request";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function CreateServiceRequestWeb3Button({ data, onWriteSuccess }: Web3Hook<ServiceRequestContract>) {
  const { write } = useCreateServiceRequest({ data, onWriteSuccess });
  const { chain } = useNetwork();

  const onClick = () => {
    if (chain?.name !== "Ethereum") {
      write?.();
    }
  };

  return (
    <ConnectWalletWrapper>
      <Button asChild size="md" type="button" onClick={onClick}>
        <span> Launch </span>
      </Button>
    </ConnectWalletWrapper>
  );
}
