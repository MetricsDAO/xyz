import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import type { SubmissionWithReward } from "~/domain/submission/schemas";
import { useContracts, useTokens } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import { fromTokenAmount } from "~/utils/helpers";
import { useReward } from "~/hooks/use-reward";

interface ClaimRewardCreatorProps {
  submission: SubmissionWithReward;
}

export function RewardSubmissionCreator({ submission }: ClaimRewardCreatorProps) {
  const tokens = useTokens();
  const token = tokens.find((t) => t.contractAddress === submission.sr.configuration.pTokenProvider);
  const displayPaymentAmount = fromTokenAmount(submission.reward.tokenAmount, token?.decimals ?? 18, 2);
  const contracts = useContracts();
  const navigate = useNavigate();
  // Get the "real time" reward and if its 0 its already been claimed
  const { data: reward } = useReward({
    laborMarketAddress: submission.laborMarketAddress,
    serviceRequestId: submission.serviceRequestId,
    submissionId: submission.id,
  });

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        // reload page
        // TODO call the index-event API and then reload the page
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
          inputs: {
            laborMarketAddress: submission.laborMarketAddress,
            serviceRequestId: submission.serviceRequestId,
            submissionId: submission.id,
          },
        }),
    });
  };

  if (!reward) {
    return <p>-</p>;
  }

  if (submission.rewardClaimed || reward.eq(0)) {
    return <p>Claimed</p>;
  }

  return (
    <>
      <TxModal
        transactor={transactor}
        title="Claim your reward!"
        confirmationMessage={
          <>
            <div className="space-y-5 mt-5">
              <div className="space-y-2">
                <div className="flex items-center">
                  <img alt="" src="/img/trophy.svg" className="h-8 w-8" />
                  <p className="text-yellow-700 text-2xl ml-2">{`${displayPaymentAmount} ${token?.symbol ?? ""}`}</p>
                </div>
                {/* TODO: Can no longer show wallet because its encoded in submissionId? */}
                {/* <div className="flex border-solid border rounded-md border-trueGray-200">
                <p className="text-sm font-semiboldborder-solid border-0 border-r border-trueGray-200 p-3">
                  {wallet.networkName}
                </p>
                <div className="flex items-center p-3">
                  <CheckCircleIcon className="mr-1 text-lime-500 h-5 w-5" />
                  <p className="text-sm text-gray-600">
                    <CopyToClipboard
                      displayContent={truncateAddress(wallet.address)}
                      content={wallet.address}
                      iconRight={<DocumentDuplicateIcon className="w-5 h-5" />}
                      hideTooltip={true}
                    />
                  </p>
                </div>
              </div>
              <p className="text-xs">
                To change or update this address head to{" "}
                <Link to="/app/rewards/addresses" className="text-blue-600">
                  Payout Addresses
                </Link>
              </p> */}
              </div>
            </div>
          </>
        }
      />
      <ConnectWalletWrapper onClick={onClick}>
        <Button>Claim</Button>
      </ConnectWalletWrapper>
    </>
  );
}

function configureFromValues({
  contracts,
  inputs,
}: {
  contracts: ReturnType<typeof useContracts>;
  inputs: {
    laborMarketAddress: EvmAddress;
    serviceRequestId: string;
    submissionId: string;
  };
}) {
  return configureWrite({
    address: inputs.laborMarketAddress,
    abi: contracts.LaborMarket.abi,
    functionName: "claim",
    args: [BigNumber.from(inputs.serviceRequestId), BigNumber.from(inputs.submissionId)],
  });
}
