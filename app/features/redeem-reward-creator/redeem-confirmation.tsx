import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import invariant from "tiny-invariant";
import { CopyToClipboard } from "~/components";
import type { SubmissionWithReward } from "~/domain/reward/functions.server";
import { fromTokenAmount, truncateAddress } from "~/utils/helpers";

export function RedeemConfirmation({ submission }: { submission: SubmissionWithReward }) {
  const { paymentTokenAmount, token } = submission.serviceProviderReward.reward;
  const displayPaymentAmount = fromTokenAmount(paymentTokenAmount, token?.decimals ?? 18, 2);
  const { wallet } = submission.serviceProviderReward;
  invariant(wallet, "Wallet should exist at this point. User may need to enter a proper payout wallet.");
  return (
    <>
      <div className="space-y-5 mt-5">
        <div className="space-y-2">
          <div className="flex items-center">
            <img alt="" src="/img/trophy.svg" className="h-8 w-8" />
            <p className="text-yellow-700 text-2xl ml-2">{`${displayPaymentAmount} ${token?.symbol ?? ""}`}</p>
          </div>
          <div className="flex border-solid border rounded-md border-trueGray-200">
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
        </div>
      </div>
    </>
  );
}
