import type { SubmissionWithReward } from "~/domain/submission/schemas";
import { useTokens } from "~/hooks/use-root-data";
import { fromTokenAmount } from "~/utils/helpers";
import { ClaimRewardCreator } from "../claim-reward-creator/claim-reward-creator";

export function ClaimButton({ submission }: { submission: SubmissionWithReward }) {
  const tokens = useTokens();
  const token = tokens.find((t) => t.contractAddress === submission.sr.configuration.pTokenProvider);
  const displayPaymentAmount = fromTokenAmount(submission.reward.tokenAmount, token?.decimals ?? 18, 2);
  return (
    <ClaimRewardCreator
      submission={submission}
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
  );
}
