import { BigNumber } from "ethers";
import { fromTokenAmount } from "~/utils/helpers";

export function CurveChart({
  type,
  token = "USDC",
  amount = "100000000000000000000",
  decimals = 18,
}: {
  type: "Constant" | "Aggressive" | "Acceptable" | "Pass / Fail";
  token?: string;
  amount?: string;
  decimals?: number;
}) {
  return (
    <div className="border rounded-lg p-6 space-y-10 w-full">
      <div className="flex gap-2 items-end">
        <h1 className="text-3xl font-semibold">{`${fromTokenAmount(amount, decimals)} ${token}`}</h1>
        <h3 className="font-semibold text-neutral-400">max earn</h3>
      </div>
      {type === "Constant" && <ConstantCurve token={token} amount={amount} decimals={decimals} />}
      {type === "Aggressive" && <AggressiveCurve token={token} amount={amount} decimals={decimals} />}
      {type === "Acceptable" && <AcceptableCurve token={token} amount={amount} decimals={decimals} />}
      {type === "Pass / Fail" && <PassFailCurve token={token} amount={amount} decimals={decimals} />}
      <div className="space-y-1">
        <div className="flex gap-1">
          <p className="text-sm font-semibold">{type} Reward Curve</p>
          <p className="text-sm font-semibold text-neutral-400">Score Range</p>
        </div>
        <p className="text-sm text-neutral-400 italic">
          How much Analysts will earn depending on the range your score falls into
        </p>
      </div>
    </div>
  );
}

function ConstantCurve({ token, amount, decimals }: { token: string; amount: string; decimals: number }) {
  return (
    <div className="hidden md:block">
      <div className="w-full flex">
        <div style={{ width: `25%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={0} />
          <div className="w-full h-2 bg-gradient-to-r from-[#F57F86] to-[#E09383] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `25%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={25} />
          <div className="w-full h-2 bg-gradient-to-r from-[#D29E80] to-[#C1AE7D] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `25%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={50} />
          <div className="w-full h-2 bg-gradient-to-r from-[#BCB27D] to-[#AAC079] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `15%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={75} />
          <div className="w-full h-2 bg-gradient-to-r from-[#AAC079] to-[#A3C877] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `10%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={100} />
          <div className="w-full h-2 bg-gradient-to-r from-[#A1C977] to-[#98D176] rounded-full mt-1" />
        </div>
      </div>

      <div className="w-full flex">
        <p className="font-semibold">0</p>
        <p style={{ width: `25%` }} className="text-right font-semibold">
          25
        </p>
        <p style={{ width: `25%` }} className="text-right font-semibold">
          50
        </p>
        <p style={{ width: `25%` }} className="text-right font-semibold">
          75
        </p>
        <p style={{ width: `15%` }} className="text-right font-semibold">
          90
        </p>
        <p style={{ width: `10%` }} className="text-right font-semibold" />
      </div>
    </div>
  );
}

function AggressiveCurve({ token, amount, decimals }: { token: string; amount: string; decimals: number }) {
  return (
    <div className="hidden md:block">
      <div className="w-full flex">
        <div style={{ width: `75%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={0} />
          <div className="w-full h-2 bg-gradient-to-r from-[#F57F86] to-[#B8B57B] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `15%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={50} />
          <div className="w-full h-2 bg-gradient-to-r from-[#AAC079] to-[#A3C877] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `10%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={100} />
          <div className="w-full h-2 bg-gradient-to-r from-[#A1C977] to-[#98D176] rounded-full mt-1" />
        </div>
      </div>

      <div className="w-full flex">
        <p className="font-semibold">0</p>
        <p style={{ width: `75%` }} className="text-right font-semibold">
          75
        </p>
        <p style={{ width: `15%` }} className="text-right font-semibold">
          90
        </p>
        <p style={{ width: `10%` }} className="text-right font-semibold" />
      </div>
    </div>
  );
}

function AcceptableCurve({ token, amount, decimals }: { token: string; amount: string; decimals: number }) {
  return (
    <div className="hidden md:block">
      <div className="w-full flex">
        <div style={{ width: `50%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={0} />
          <div className="w-full h-2 bg-gradient-to-r from-[#F57F86] to-[#C1AE7D] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `25%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={50} />
          <div className="w-full h-2 bg-gradient-to-r from-[#BCB27D] to-[#AAC079] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `25%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={100} />
          <div className="w-full h-2 bg-gradient-to-r from-[#AAC079] to-[#98D176] rounded-full mt-1" />
        </div>
      </div>

      <div className="w-full flex">
        <p className="font-semibold">0</p>
        <p style={{ width: `50%` }} className="text-right font-semibold">
          50
        </p>
        <p style={{ width: `25%` }} className="text-right font-semibold">
          75
        </p>
        <p style={{ width: `25%` }} className="text-right font-semibold" />
      </div>
    </div>
  );
}

function PassFailCurve({ token, amount, decimals }: { token: string; amount: string; decimals: number }) {
  return (
    <div className="hidden md:block">
      <div className="w-full flex">
        <div style={{ width: `70%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={0} />
          <div className="w-full h-2 bg-rose-400 rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `30%` }} className="font-semibold justify-between flex flex-col">
          <AmountInPercent amount={amount} token={token} decimals={decimals} percent={100} />
          <div className="w-full h-2 bg-lime-300 rounded-full mt-1" />
        </div>
      </div>

      <div className="w-full flex">
        <p className="font-semibold">0</p>
        <p style={{ width: `70%` }} className="text-right font-semibold">
          70
        </p>
        <p style={{ width: `30%` }} className="text-right font-semibold" />
      </div>
    </div>
  );
}

function AmountInPercent({
  amount,
  decimals,
  percent,
  token,
}: {
  amount: string;
  decimals: number;
  percent: number;
  token: string;
}) {
  return (
    <>
      <p className="text-sm font-medium">{`${percent}%`}</p>
      <p className="text-sm text-neutral-400 font-semibold">{`(${fromTokenAmount(
        BigNumber.from(amount).mul(percent).div(100).toString(),
        decimals
      )} ${token})`}</p>
    </>
  );
}
