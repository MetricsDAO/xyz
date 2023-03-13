import { Button } from "~/components";
import type { ServiceRequestContract } from "~/domain/service-request/schemas";
import { useCreateServiceRequest } from "~/hooks/use-create-service-request";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function CreateServiceRequestWeb3Button(props: Web3Hook<ServiceRequestContract>) {
  const { write } = useCreateServiceRequest(props);

  const onClick = () => {
    write?.();
  };

  return (
    <ConnectWalletWrapper onClick={onClick}>
      <Button size="md" type="button">
        Launch
      </Button>
    </ConnectWalletWrapper>
  );
}
