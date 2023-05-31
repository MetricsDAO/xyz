import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { Button, Progress } from "~/components";

export function FormProgress({
  percent,
  onGoBack,
  onNext,
  cancelLink,
  submitLabel,
}: {
  percent: number;
  onGoBack?: () => void;
  onNext?: () => void;
  cancelLink: string;
  submitLabel?: string;
}) {
  return (
    <div className=" w-full">
      <Progress progress={percent} />
      <div className="flex items-center justify-evenly">
        <div className="flex items-center">
          {onGoBack && (
            <div className="flex gap-3 items-center cursor-pointer" onClick={onGoBack}>
              <ArrowLeftCircleIcon className="h-8 w-8 text-black" />
              <p className="mr-6 text-black">Prev</p>
            </div>
          )}
          {onNext && (
            <button className="flex gap-3 items-center cursor-pointer" onClick={onNext}>
              <p>Next</p>
              <ArrowRightCircleIcon className="h-8 w-8 text-black" />
            </button>
          )}
        </div>
        <div className="flex items-center">
          <Button className="my-5 mr-4" variant="cancel">
            <Link to={cancelLink}>Cancel</Link>
          </Button>
          {submitLabel && <Button type="submit">{submitLabel}</Button>}
        </div>
      </div>
    </div>
  );
}
