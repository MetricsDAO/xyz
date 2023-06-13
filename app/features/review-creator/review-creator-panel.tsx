import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import { Button, Error, Field, Label, scoreToLabel } from "~/components";
import { useState } from "react";
import { ClientOnly } from "remix-utils";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { SCORE_COLOR } from "~/utils/constants";

export function ReviewCreatorPanel() {
  const [selectedScore, setValue] = useState(2);

  const reviews = [
    {
      comment: "Comments are optional but highly encouraged to help people better understand your evaluation. ",
      user: "2323",
      time: Date(),
      score: 1,
    },
    { comment: "lol", user: "2323", time: Date(), score: 4 },
    {
      comment: "Comments are optional but highly encouraged to help people better understand your evaluation. ",
      user: "2323",
      time: Date(),
      score: 4,
    },
    { comment: "lol", user: "2323", time: Date(), score: 0 },
    {
      comment: "Comments are optional but highly encouraged to help people better understand your evaluation. ",
      user: "2323",
      time: Date(),
      score: 2,
    },
    { comment: "lol", user: "2323", time: Date(), score: 3 },
  ];

  return (
    <div className="mx-auto max-w-2xl border h-screen">
      <div className="flex border justify-between bg-white p-3">
        <div className="flex space-x-4">
          <div className="flex gap-2">
            <div className="bg-gray-100 p-1 rounded-full">
              <ChevronLeftIcon className="text-black h-4" />
            </div>
            <p className="text-sm">4/25</p>
            <div className="bg-gray-100 p-1 rounded-full">
              <ChevronRightIcon className="text-black h-4" />
            </div>
          </div>
          <p>User</p>
          <p>Time</p>
        </div>
        <p>Close arrow?</p>
      </div>
      <div className="space-y-4 bg-blue-300 p-10 overflow-y-auto h-3/5">
        {reviews.map((r) => (
          <div key={r.time} className="bg-white border rounded-md p-6 space-y-3">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <p>User</p>
                <p className="text-stone-500 text-sm">Time</p>
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
            <p className="text-stone-500 text-sm">{r.comment}</p>
          </div>
        ))}
      </div>
      <div className="border bg-white p-4 space-y-4">
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
          <Button>Cancel</Button>
          <Button>Submit Score</Button>
        </div>
      </div>
    </div>
  );
}
