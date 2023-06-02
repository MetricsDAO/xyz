import { CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export function FormStepper({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="flex flex-col justify-items-start lg:block">
      {labels.map((label, index) => (
        <>
          {index > 0 && (
            <div
              className={clsx("h-10 w-px ml-3", {
                "bg-stone-300": index >= step,
                "bg-blue-400": index < step,
              })}
            />
          )}
          <div className="flex items-center gap-6 justify-items-start">
            <div
              className={clsx("flex items-center justify-center h-6 w-6 rounded-full border", {
                "border-neutral-400": index >= step,
                "border-blue-400": index < step,
                "bg-blue-600": index + 1 === step,
              })}
            >
              <span
                className={clsx("font-normal text-sm", {
                  "text-white": index < step,
                  "text-stone-500": index >= step,
                })}
              >
                {index + 1 >= step ? `${index + 1}` : <CheckIcon className="text-blue-600 h-3 w-3" />}
              </span>
            </div>
            <p
              className={clsx("text-sm", { "text-stone-500": index >= step, "text-blue-600": index < step })}
            >{`${label}`}</p>
          </div>
        </>
      ))}
    </div>
  );
}
