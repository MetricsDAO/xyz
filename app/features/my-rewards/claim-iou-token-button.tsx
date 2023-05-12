import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import { useNetwork } from "wagmi";
import { CopyToClipboard } from "~/components";
import type { EvmAddress } from "~/domain/address";
import type { SubmissionWithReward } from "~/domain/reward/functions.server";
import { useUser } from "~/hooks/use-user";
import { fromTokenAmount, truncateAddress } from "~/utils/helpers";
import { ClaimRewardCreator } from "../claim-reward-creator/claim-reward-creator";
import { NoPayoutAddressFoundModalButton } from "./no-payout-address-modal-button";

export function ClaimIouTokenButton({ submission }: { submission: SubmissionWithReward }) {
  const user = useUser();
  const network = useNetwork();

  // Claim to the signed in wallet instead of user specified wallet
  const payoutAddress = user.address as EvmAddress;
  const networkName = network.chain?.name;

  if (!payoutAddress) {
    return <NoPayoutAddressFoundModalButton buttonText="Claim" networkName={networkName} />;
  }

  const { paymentTokenAmount, token, hasClaimed } = submission.serviceProviderReward.reward;
  const displayPaymentAmount = fromTokenAmount(paymentTokenAmount, token?.decimals ?? 18, 2);
  return (
    <ClaimRewardCreator
      disabled={hasClaimed}
      laborMarketAddress={submission.laborMarketAddress}
      submissionId={submission.id}
      payoutAddress={payoutAddress}
      confirmationMessage={
        <>
          <div className="space-y-5 mt-5">
            <div className="space-y-2">
              <div className="flex items-center">
                <img alt="" src="/img/trophy.svg" className="h-8 w-8" />
                <p className="text-yellow-700 text-2xl ml-2">{`${displayPaymentAmount} ${token?.symbol ?? ""}`}</p>
              </div>
              <div className="flex border-solid border rounded-md border-trueGray-200">
                <p className="text-sm font-semiboldborder-solid border-0 border-r border-trueGray-200 p-3">
                  {networkName}
                </p>
                <div className="flex items-center p-3">
                  <CheckCircleIcon className="mr-1 text-lime-500 h-5 w-5" />
                  <p className="text-sm text-gray-600">
                    <CopyToClipboard
                      displayContent={truncateAddress(payoutAddress)}
                      content={payoutAddress}
                      iconRight={<DocumentDuplicateIcon className="w-5 h-5" />}
                      hideTooltip={true}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}
