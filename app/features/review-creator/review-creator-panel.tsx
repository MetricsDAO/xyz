import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import { Button, Error, Field, Label, UserBadge, scoreToLabel } from "~/components";
import { useState } from "react";
import { ClientOnly } from "remix-utils";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { SCORE_COLOR } from "~/utils/constants";
import { formatDate } from "~/utils/date";

export function ReviewCreatorPanel() {
  const [selectedScore, setValue] = useState(2);

  const submission = {
    configuration: { fulfiller: "0x688407D977a6c58fb8c4e431a962cF1EfFbEFA06" },
    blockTimestamp: new Date(),
  };

  const reviews = [
    {
      comment: "Comments are optional but highly encouraged to help people better understand your evaluation. ",
      reviewer: "0x688407D977a6c58fb8c4e431a962cF1EfFbEFA06",
      blockTimestamp: new Date(),
      score: 1,
    },
    { reviewer: "0x688407D977a6c58fb8c4e431a962cF1EfFbEFA06", blockTimestamp: new Date(), score: 4 },
    {
      comment: "Comments are optional but highly encouraged to help people better understand your evaluation. ",
      reviewer: "0x688407D977a6c58fb8c4e431a962cF1EfFbEFA06",
      blockTimestamp: new Date(),
      score: 4,
    },
    { comment: "lol", reviewer: "0x688407D977a6c58fb8c4e431a962cF1EfFbEFA06", blockTimestamp: new Date(), score: 0 },
    {
      comment: "Comments are optional but highly encouraged to help people better understand your evaluation. ",
      reviewer: "0x688407D977a6c58fb8c4e431a962cF1EfFbEFA06",
      blockTimestamp: new Date(),
      score: 2,
    },
    { comment: "lol", reviewer: "0x688407D977a6c58fb8c4e431a962cF1EfFbEFA06", blockTimestamp: new Date(), score: 3 },
  ];

  return (
    <div className="mx-auto max-w-2xl h-screen">
      <div className="flex border justify-between bg-white p-3">
        <div className="flex space-x-4 items-center">
          <div className="flex gap-2 items-center">
            <div className="bg-gray-100 p-1 rounded-full">
              <ChevronLeftIcon className="text-black h-4" />
            </div>
            <p className="text-sm">4/25</p>
            <div className="bg-gray-100 p-1 rounded-full">
              <ChevronRightIcon className="text-black h-4" />
            </div>
          </div>
          <UserBadge address={submission.configuration.fulfiller as `0x${string}`} />
          <p className="text-xs border rounded-full py-1.5 px-2 text-stone-500">
            {formatDate(submission.blockTimestamp, "MMM D, h:mm A")}
          </p>
        </div>
        <div className="flex gap-px items-center">
          <ArrowRightIcon className="text-black h-4" />
          <div className="bg-black h-4 w-px" />
        </div>
      </div>
      <div className="space-y-4 bg-blue-300 p-10 overflow-y-auto h-3/5">
        {reviews.map((r) => (
          <div key={r.blockTimestamp} className="bg-white border rounded-md p-6 space-y-3">
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <UserBadge address={submission.configuration.fulfiller as `0x${string}`} />
                <p className="text-stone-500 text-sm">{formatDate(r.blockTimestamp, "MMM D, h:mm A")}</p>
              </div>
              <div
                className={clsx(
                  SCORE_COLOR[scoreToLabel(Number(r.score) * 25)],
                  "flex w-24 h-9 justify-center items-center rounded-lg text-sm"
                )}
              >
                <p>{scoreToLabel(Number(r.score) * 25)}</p>
              </div>
            </div>
            {r.comment && <p className="text-stone-500 text-sm">{r.comment}</p>}
          </div>
        ))}
      </div>
      <div className="border bg-white p-4 space-y-4 h-1/3 overflow-y-auto">
        <div className="flex flex-row gap-4 justify-between">
          <Button
            fullWidth
            variant="gray"
            type="button"
            onClick={() => setValue(4)}
            className={clsx("hover:bg-lime-100", {
              "bg-lime-100": selectedScore === 4,
            })}
          >
            Stellar
          </Button>
          <Button
            fullWidth
            variant="gray"
            type="button"
            onClick={() => setValue(3)}
            className={clsx("hover:bg-blue-200", {
              "bg-blue-200": selectedScore === 3,
            })}
          >
            Good
          </Button>
          <Button
            fullWidth
            variant="gray"
            type="button"
            onClick={() => setValue(2)}
            className={clsx("hover:bg-neutral-200", {
              "bg-neutral-200": selectedScore === 2,
            })}
          >
            Average
          </Button>
          <Button
            fullWidth
            variant="gray"
            type="button"
            onClick={() => setValue(1)}
            className={clsx("hover:bg-orange-200", {
              "bg-orange-200": selectedScore === 1,
            })}
          >
            Bad
          </Button>
          <Button
            fullWidth
            variant="gray"
            type="button"
            onClick={() => setValue(0)}
            className={clsx("hover:bg-rose-200", {
              "bg-rose-200": selectedScore === 0,
            })}
          >
            Spam
          </Button>
          {/*<input type="hidden" {...register("score")} />
        <Error error={errors.score?.message} />*/}
        </div>
        <Field>
          <ClientOnly>
            {() => (
              <div className="container overflow-auto">
                <MarkdownEditor
                  value={"watch(description)"}
                  onChange={(v) => {
                    setValue("description", v ?? "");
                  }}
                />
              </div>
            )}
          </ClientOnly>
          {/*<Error error={errors.description?.message} />*/}
        </Field>
        <div className="flex gap-3 justify-end">
          <Button variant="cancel">Cancel</Button>
          <Button>Submit Score</Button>
        </div>
      </div>
    </div>
  );
}
