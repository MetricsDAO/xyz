import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";

interface ClaimRewardCreatorProps {
  laborMarketAddress: string;
  submissionId: string;
  payoutAddress: string;
  confirmationMessage?: React.ReactNode;
}

export function ClaimRewardCreator({
  laborMarketAddress,
  submissionId,
  payoutAddress,
  confirmationMessage,
}: ClaimRewardCreatorProps) {
  const contracts = useContracts();
  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        // reload page
        navigate(0);
      },
      [navigate]
    ),
  });

  const onClick = () => {
    transactor.start({
      config: () =>
        configureFromValues({
          contracts,
          laborMarketAddress: laborMarketAddress as `0x${string}`,
          submissionId,
          payoutAddress: payoutAddress as `0x${string}`,
        }),
    });
  };

  return (
    <>
      <TxModal transactor={transactor} title="Claim your reward!" confirmationMessage={confirmationMessage} />
      <ConnectWalletWrapper onClick={onClick}>
        <Button>Claim</Button>
      </ConnectWalletWrapper>
    </>
  );
}

function configureFromValues({
  contracts,
  laborMarketAddress,
  submissionId,
  payoutAddress,
}: {
  contracts: ReturnType<typeof useContracts>;
  laborMarketAddress: `0x${string}`;
  submissionId: string;
  payoutAddress: `0x${string}`;
}) {
  return configureWrite({
    address: laborMarketAddress,
    abi: contracts.LaborMarket.abi,
    functionName: "claim",
    args: [BigNumber.from(submissionId), payoutAddress],
  });
}
