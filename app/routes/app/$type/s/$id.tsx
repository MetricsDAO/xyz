import { Link, useSubmit } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import clsx from "clsx";
import { useRef, useState } from "react";
import { getParamsOrFail } from "remix-params-helper";
import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { notFound } from "remix-utils";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Detail,
  DetailItem,
  Drawer,
  UserBadge,
  ValidatedSelect,
} from "~/components";
import { RewardBadge } from "~/components/reward-badge";
import { ScoreBadge, scoreNumToLabel } from "~/components/score";
import { ReviewSearchSchema } from "~/domain/review";
import { searchReviews } from "~/services/review-service.server";
import { findSubmission } from "~/services/submissions.server";
import { fromNow } from "~/utils/date";
import { SCORE_COLOR } from "~/utils/helpers";
import { toast } from "react-hot-toast";
import { useReviewSubmission } from "~/hooks/use-review-submission";

const paramsSchema = z.object({ id: z.string() });

const validator = withZod(ReviewSearchSchema);

export const loader = async (data: DataFunctionArgs) => {
  const { id } = paramsSchema.parse(data.params);
  const url = new URL(data.request.url);
  const params = getParamsOrFail(url.searchParams, ReviewSearchSchema);
  params.submissionId = id;
  const reviews = await searchReviews(params);

  const submission = await findSubmission(id);
  if (!submission) {
    throw notFound({ id });
  }

  return typedjson({ submission, reviews, params }, { status: 200 });
};

export default function ChallengeSubmission() {
  const { submission, reviews, params } = useTypedLoaderData<typeof loader>();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };

  const isWinner = true;

  return (
    <Container className="py-16">
      <div className="mx-auto container mb-12 px-10">
        <section className="flex flex-wrap gap-5 justify-between pb-10">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold">{submission.title}</h1>
            {isWinner && <img className="w-12 h-12" src="/img/trophy.svg" alt="trophy" />}
          </div>
          <ReviewQuestionDrawerButton requestId={submission.serviceRequestId} submissionId={submission.id} />
        </section>
        <section className="flex flex-col space-y-7 pb-24">
          <Detail className="flex flex-wrap gap-x-8 gap-y-4">
            <DetailItem title="Author">
              <UserBadge url="u/id" address="0x983110309620D911731Ac0932219af06091b6744" balance={200} />
            </DetailItem>
            <DetailItem title="Created">
              <Badge>{fromNow(submission.createdAt.toString())}</Badge>
            </DetailItem>
            <DetailItem title="Overall Score">
              <ScoreBadge score={10} />
            </DetailItem>
            <DetailItem title="Reviews">
              <Badge>{reviews.length}</Badge>
            </DetailItem>
            {isWinner && (
              <DetailItem title="Winner">
                <RewardBadge amount={50} token="SOL" rMETRIC={100} variant="winner" />
              </DetailItem>
            )}
          </Detail>
          <p className="text-gray-500 max-w-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac augue interdum mattis elit quam sapien tellus
            pellentesque. Vel magna consectetur mauris eu. Mauris arcu diam dolor ut tincidunt. Sit euismod sit
            fermentum, consequat maecenas. Ante odio eget nunc velit id volutpat. Aliquam leo non viverra metus, ligula
            commodo aliquet velit massa. Lacinia lacus amet massa
          </p>
        </section>
        <h2 className="text-lg font-semibold border-b border-gray-100 py-4 mb-6">Reviews ({reviews.length})</h2>

        <section className="mt-3">
          <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
            <main className="flex-1">
              <div className="w-full border-spacing-4 border-separate space-y-5">
                {reviews.map((r) => {
                  return (
                    <Card asChild key={r.id}>
                      <Link
                        to="/u/[uId]"
                        className="flex flex-col md:flex-row gap-3 py-3 px-4 items-center space-between"
                      >
                        <div className="flex flex-col md:flex-row items-center flex-1 gap-2">
                          <div
                            className={clsx(
                              SCORE_COLOR[scoreNumToLabel(r.score)],
                              "flex w-24 h-12 justify-center items-center rounded-lg"
                            )}
                          >
                            <p>{scoreNumToLabel(r.score)}</p>
                          </div>
                          <Avatar />
                          <p className="font-medium">user.ETH</p>
                          <Badge>
                            <p>400 rMETRIC</p>
                          </Badge>
                        </div>
                        <p>{fromNow(r.createdAt)}</p>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </main>
            <aside className="md:w-1/5">
              <ValidatedForm
                formRef={formRef}
                method="get"
                defaultValues={params}
                validator={validator}
                onChange={handleChange}
                className="space-y-3 p-4 border border-gray-300/50 rounded-lg bg-brand-400 bg-opacity-5 text-sm"
              >
                {/* <Input placeholder="Search" name="search" iconLeft={<MagnifyingGlassIcon className="w-5 h-5" />} /> */}
                <ValidatedSelect
                  placeholder="Select option"
                  name="sortBy"
                  size="sm"
                  onChange={handleChange}
                  options={[{ label: "Created At", value: "createdAt" }]}
                />
                <Checkbox onChange={handleChange} id="great_checkbox" name="score" value="Great" label="Great" />
                <Checkbox onChange={handleChange} id="good_checkbox" name="score" value="Good" label="Good" />
                <Checkbox onChange={handleChange} id="average_checkbox" name="score" value="Average" label="Average" />
                <Checkbox onChange={handleChange} id="bad_checkbox" name="score" value="Bad" label="Bad" />
                <Checkbox onChange={handleChange} id="spam_checkbox" name="score" value="Spam" label="Spam" />
              </ValidatedForm>
            </aside>
          </div>
        </section>
      </div>
    </Container>
  );
}

function ReviewQuestionDrawerButton({ requestId, submissionId }: { requestId: string; submissionId: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<100 | 75 | 50 | 25 | 0>(50);

  const { write, isLoading } = useReviewSubmission({
    data: [requestId, submissionId, selected],
    onTransactionSuccess() {
      toast.dismiss("review-submission");
      toast.success("Submission Reviewed!");
    },
    onWriteSuccess() {
      toast.loading("Reviewing Submision...", { id: "review-submission" });
      setOpen(false);
    },
  });

  const onCreate = () => {
    write?.();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Review Question</Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col mx-auto space-y-10 px-2">
          <div className="space-y-3">
            <p className="text-3xl font-semibold">Review Question</p>
            <p className="italic text-gray-500">
              Important: You can't edit this score after submitting. Double check your score and ensure it's good to go
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <Button
              variant="outline"
              onClick={() => setSelected(100)}
              className={clsx("hover:bg-green-200", {
                "bg-green-200": selected === 100,
              })}
            >
              Great
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelected(75)}
              className={clsx("hover:bg-blue-200", {
                "bg-blue-200": selected === 75,
              })}
            >
              Good
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelected(50)}
              className={clsx("hover:bg-gray-200", {
                "bg-gray-200": selected === 50,
              })}
            >
              Average
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelected(25)}
              className={clsx("hover:bg-orange-200", {
                "bg-orange-200": selected === 25,
              })}
            >
              Bad
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelected(0)}
              className={clsx("hover:bg-red-200", {
                "bg-red-200": selected === 0,
              })}
            >
              Spam
            </Button>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="cancel" className="w-full" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="w-full" onClick={onCreate}>
              Submit Score
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
