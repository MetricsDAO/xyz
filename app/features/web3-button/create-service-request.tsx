import { Button } from "~/components";
import type { ServiceRequestContract } from "~/domain";
import { useCreateServiceRequest } from "~/hooks/use-create-service-request";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function CreateServiceRequestWeb3Button(props: Web3Hook<ServiceRequestContract>) {
  const { write } = useCreateServiceRequest(props);

  const onClick = () => {
    write?.();
  };

  return (
    <ConnectWalletWrapper>
      <Button size="md" type="button" onClick={onClick}>
        Launch
      </Button>
    </ConnectWalletWrapper>
  );
}
