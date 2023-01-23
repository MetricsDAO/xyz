import { useAccount } from "wagmi";
import { Button } from "~/components";

type ButtonProps = React.ComponentProps<typeof Button>;

export function ConnectWalletGuardButton(props: ButtonProps) {
  const acc = useAccount();

  return acc.status === "connected" ? (
    <Button {...props} variant="danger" disabled>
      Please connect wallet
    </Button>
  ) : (
    <Button {...props}>{props.children}</Button>
  );
}
