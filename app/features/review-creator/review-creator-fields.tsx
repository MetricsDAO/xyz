import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import { Button, Error } from "~/components";
import type { ReviewFormValues } from "./review-creator-values";

export function ReviewCreatorFields() {
  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<ReviewFormValues>();

  const selectedScore = watch("score");
  return (
    <div className="flex flex-col mx-auto space-y-10 px-2">
      <div className="space-y-3">
        <p className="text-3xl font-semibold">Review & Score</p>
        <p className="italic text-gray-500 text-sm">
          Important: You can't edit this score after submitting. Double check your score and ensure it's good to go
        </p>
      </div>
      <div className="flex flex-col space-y-3">
        <Button
          variant="gray"
          type="button"
          onClick={() => setValue("score", 100)}
          className={clsx("hover:bg-lime-100", {
            "bg-lime-100": selectedScore === 100,
          })}
        >
          Stellar
        </Button>
        <Button
          variant="gray"
          type="button"
          onClick={() => setValue("score", 75)}
          className={clsx("hover:bg-blue-200", {
            "bg-blue-200": selectedScore === 75,
          })}
        >
          Good
        </Button>
        <Button
          variant="gray"
          type="button"
          onClick={() => setValue("score", 50)}
          className={clsx("hover:bg-neutral-200", {
            "bg-neutral-200": selectedScore === 50,
          })}
        >
          Average
        </Button>
        <Button
          variant="gray"
          type="button"
          onClick={() => setValue("score", 25)}
          className={clsx("hover:bg-orange-200", {
            "bg-orange-200": selectedScore === 25,
          })}
        >
          Bad
        </Button>
        <Button
          variant="gray"
          type="button"
          onClick={() => setValue("score", 0)}
          className={clsx("hover:bg-rose-200", {
            "bg-rose-200": selectedScore === 0,
          })}
        >
          Spam
        </Button>
        <input type="hidden" {...register("score")} />
        <Error error={errors.score?.message} />
      </div>
    </div>
  );
}
