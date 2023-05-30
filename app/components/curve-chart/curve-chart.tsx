import { BigNumber } from "ethers";

export function CurveChart({
  type,
  token = "USDC",
  amount = "100",
}: {
  type: "Constant" | "Aggresive" | "Acceptable" | "Pass / Fail";
  token?: string;
  amount?: string;
}) {
  return (
    <div className="border rounded-lg p-6 space-y-10">
      <div className="flex gap-2 items-end">
        <h1 className="text-3xl font-semibold">{`${amount} ${token}`}</h1>
        <h3 className="font-semibold text-neutral-400">max earn</h3>
      </div>
      {type === "Constant" && <ConstantCurve token={token} amount={amount} />}
      {type === "Aggresive" && <AggresiveCurve token={token} amount={amount} />}
      {type === "Acceptable" && <AcceptableCurve token={token} amount={amount} />}
      {type === "Pass / Fail" && <PassFailCurve token={token} amount={amount} />}
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

function ConstantCurve({ token, amount }: { token: string; amount: string }) {
  return (
    <div className="hidden md:block">
      <div className="w-full flex">
        <div style={{ width: `25%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">0%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(0 ${token})`}</p>
          <div className="w-full h-2 bg-gradient-to-r from-[#F57F86] to-[#E09383] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `25%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">25%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(${BigNumber.from(amount)
            .mul(25)
            .div(100)
            .toString()} ${token})`}</p>
          <div className="w-full h-2 bg-gradient-to-r from-[#D29E80] to-[#C1AE7D] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `25%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">50%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(${BigNumber.from(amount)
            .mul(50)
            .div(100)
            .toString()} ${token})`}</p>
          <div className="w-full h-2 bg-gradient-to-r from-[#BCB27D] to-[#AAC079] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `15%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">75%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(${BigNumber.from(amount)
            .mul(75)
            .div(100)
            .toString()} ${token})`}</p>
          <div className="w-full h-2 bg-gradient-to-r from-[#AAC079] to-[#A3C877] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `10%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">100%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(${amount} ${token})`}</p>
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

function AggresiveCurve({ token, amount }: { token: string; amount: string }) {
  return (
    <div className="hidden md:block">
      <div className="w-full flex">
        <div style={{ width: `50%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">0%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(0 ${token})`}</p>
          <div className="w-full h-2 bg-gradient-to-r from-[#F57F86] to-[#C1AE7D] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `25%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">50%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(${BigNumber.from(amount)
            .mul(50)
            .div(100)
            .toString()} ${token})`}</p>
          <div className="w-full h-2 bg-gradient-to-r from-[#BCB27D] to-[#AAC079] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `15%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">75%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(${BigNumber.from(amount)
            .mul(75)
            .div(100)
            .toString()} ${token})`}</p>
          <div className="w-full h-2 bg-gradient-to-r from-[#AAC079] to-[#A3C877] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `10%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">100%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(${amount} ${token})`}</p>
          <div className="w-full h-2 bg-gradient-to-r from-[#A1C977] to-[#98D176] rounded-full mt-1" />
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
        <p style={{ width: `15%` }} className="text-right font-semibold">
          90
        </p>
        <p style={{ width: `10%` }} className="text-right font-semibold" />
      </div>
    </div>
  );
}

function AcceptableCurve({ token, amount }: { token: string; amount: string }) {
  return (
    <div className="hidden md:block">
      <div className="w-full flex">
        <div style={{ width: `75%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">0%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(0 ${token})`}</p>
          <div className="w-full h-2 bg-gradient-to-r from-[#F57F86] to-[#B8B57B] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `15%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">75%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(${BigNumber.from(amount)
            .mul(75)
            .div(100)
            .toString()} ${token})`}</p>
          <div className="w-full h-2 bg-gradient-to-r from-[#AAC079] to-[#A3C877] rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `10%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">100%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(${amount} ${token})`}</p>
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

function PassFailCurve({ token, amount }: { token: string; amount: string }) {
  return (
    <div className="hidden md:block">
      <div className="w-full flex">
        <div style={{ width: `70%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">0%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(0 ${token})`}</p>
          <div className="w-full h-2 bg-rose-400 rounded-full mt-1" />
        </div>
        <div className="border border-[#C9C9C9] h-16 mx-1 self-center" />
        <div style={{ width: `30%` }} className="font-semibold justify-between flex flex-col">
          <p className="text-sm font-medium">100%</p>
          <p className="text-sm text-neutral-400 font-semibold">{`(${amount} ${token})`}</p>
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
