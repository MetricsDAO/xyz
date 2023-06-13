import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import { Button, Error, Field, Label } from "~/components";
import type { ReviewFormValues } from "./review-creator-values";
import { useState } from "react";
import { ClientOnly } from "remix-utils";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";

export function ReviewCreatorPanel() {
  const [selectedScore, setValue] = useState(2);

  const reviews = [
    {
      comment: "Comments are optional but highly encouraged to help people better understand your evaluation. ",
      user: "2323",
      time: Date(),
      score: 4,
    },
    { comment: "lol", user: "2323", time: Date(), score: 4 },
    {
      comment: "Comments are optional but highly encouraged to help people better understand your evaluation. ",
      user: "2323",
      time: Date(),
      score: 4,
    },
    { comment: "lol", user: "2323", time: Date(), score: 4 },
    {
      comment: "Comments are optional but highly encouraged to help people better understand your evaluation. ",
      user: "2323",
      time: Date(),
      score: 4,
    },
    { comment: "lol", user: "2323", time: Date(), score: 4 },
  ];

  return (
    <div className="mx-auto max-w-2xl border">
      <div className="flex border justify-between bg-white p-3">
        <div className="flex space-x-4">
          <p>Arrows</p>
          <p>User</p>
          <p>Time</p>
        </div>
        <p>Close arrow?</p>
      </div>
      <div className="space-y-4 bg-blue-500 p-10">
        {reviews.map((r) => (
          <div key={r.time} className="bg-white border rounded-md">
            <p>User</p>
            <p>Time</p>
            <p>Score</p>
            <p>Comment</p>
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
