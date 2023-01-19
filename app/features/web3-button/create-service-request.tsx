import { Button } from "~/components";
import type { ServiceRequestContract } from "~/domain";
import { useCreateServiceRequest } from "~/hooks/use-create-service-request";
import type { Web3Hook } from "./types";

export function CreateServiceRequestWeb3Button({ data, onWriteSuccess }: Web3Hook<ServiceRequestContract>) {
  const { write } = useCreateServiceRequest({ data, onWriteSuccess });

  const onClick = () => {
    write?.();
  };

  return (
    <Button size="md" type="button" onClick={onClick}>
      Create
    </Button>
  );
}
