import { CountDown } from "./CountDown";

export function CountDownCard({ progress, time, subText }: { progress: number; time: string; subText?: string }) {
  return (
    <div className="border border-[#EDEDED] rounded-md shadow-md">
      {progress >= 100 ? (
        <div className="w-full bg-[#EDEDED] h-2.5 rounded-t-md " />
      ) : (
        <div className="w-full bg-[#16ABDDCC] h-2.5 rounded-t-md ">
          <label className="sr-only">Progess bar with {100 - progress} percent left</label>
          <div
            style={{
              width: `${100 - progress}%`,
            }}
            className="visible w-full rounded-tl-md h-2.5 bg-[#EDEDED]"
          />
        </div>
      )}
      <div className="flex flex-col items-center my-6 px-3">
        <p className="text-2xl">
          <CountDown date={time} />
        </p>
        <p>{subText}</p>
      </div>
    </div>
  );
}
