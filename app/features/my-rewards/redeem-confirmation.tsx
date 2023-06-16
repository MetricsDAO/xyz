import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import type { Token, Wallet } from "@prisma/client";
import { CopyToClipboard } from "~/components";
import { fromTokenAmount, truncateAddress } from "~/utils/helpers";

type RedeemConfirmationType = {
  payoutAmount: string;
  token?: Token;
  wallet: Wallet;
};

export function RedeemConfirmation({ payoutAmount, token, wallet }: RedeemConfirmationType) {
  const displayPaymentAmount = fromTokenAmount(payoutAmount, token?.decimals ?? 18, 2);
  return (
    <>
      <div className="space-y-5 mt-5">
        <div className="space-y-2">
          <div className="flex items-center">
            <img alt="" src="/img/trophy.svg" className="h-8 w-8" />
            <p className="text-yellow-700 text-2xl ml-2">{`${displayPaymentAmount} ${token?.iouSymbol ?? ""}`}</p>
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
